import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, STORAGE_BASE_URL } from "../../config";

const EnrolledStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");          

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  const fetchEnrolledStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_BASE_URL}/enrollment/getenrollmentdata?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        setStudents(data.data.data);
      } else {
        setError("Failed to fetch enrolled students");
      }
    } catch (err) {
      console.error("Failed to load enrolled students", err);
      setError("Error loading enrolled students");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────── helpers (unchanged) ──────────────────── */
  const isBase64Data = (d) =>
    !!d &&
    (d.startsWith("data:application/pdf;base64,") ||
      (d.length > 100 && !d.includes("/") && !d.includes(".")));

  const getAgreementUrl = (path) => {
    if (!path || isBase64Data(path)) return null;
    const clean = path.replace(/^storage\//, "");
    const finalPath = clean.startsWith("useragreements/") ? clean : `useragreements/${clean}`;
    return `${STORAGE_BASE_URL}/${finalPath}`;
  };

  const createBlobFromBase64 = (b64) => {
    try {
      let s = b64.startsWith("data:application/pdf;base64,")
        ? b64.replace("data:application/pdf;base64,", "")
        : b64;
      const bin = window.atob(s);
      const bytes = Uint8Array.from([...bin].map((c) => c.charCodeAt(0)));
      return new Blob([bytes], { type: "application/pdf" });
    } catch (e) {
      console.error("Error creating blob from base64:", e);
      return null;
    }
  };

  /* ───────────────────── search filtering ──────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return students;

    const q = search.trim().toLowerCase();
    return students.filter((en) => {
      const title   = en.course?.title ?? "";
      const sName   = en.student?.username ?? en.student?.name ?? "";
      const status  = en.status ?? "";
      const dateStr = new Date(en.enrollment_date).toLocaleDateString();

      return (
        title.toLowerCase().includes(q) ||
        sName.toLowerCase().includes(q) ||
        status.toLowerCase().includes(q) ||
        dateStr.toLowerCase().includes(q)
      );
    });
  }, [search, students]);

  /* ───────────────────── view / download helpers stay unchanged ──────────────────── */
  const viewAgreement = (en) => {
    const data = en.useragreement;
    if (!data) return alert("No agreement data available");

    if (isBase64Data(data)) {
      const blob = createBlobFromBase64(data);
      if (!blob) return alert("Failed to process base64 agreement data");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else {
      window.open(getAgreementUrl(data), "_blank");
    }
  };

  const downloadAgreementDirect = (en) => {
    const data = en.useragreement;
    if (!data) return alert("No agreement data available");
    if (!isBase64Data(data)) return alert("Please use the API download button for file-based agreements");

    const blob = createBlobFromBase64(data);
    if (!blob) return alert("Failed to process PDF data");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agreement_${en.enrollment_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  /* ───────────────────── UI ──────────────────── */
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        <span className="ml-3 text-lg">Loading enrolled students…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchEnrolledStudents}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* counts based on filtered list */
  const countByStatus = (st) => filtered.filter((s) => s.status === st).length;

  return (
    <div className="p-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Enrolled Students</h1>

        <div className="flex gap-3">
          {/* 🔍 search bar */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, name, status, date…"
            className="w-60 md:w-72 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* refresh button */}
          <button
            onClick={fetchEnrolledStudents}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Students</h3>
          <p className="text-2xl font-bold text-blue-600">{filtered.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Enrolled</h3>
          <p className="text-2xl font-bold text-green-600">{countByStatus("enrolled")}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">In Progress</h3>
          <p className="text-2xl font-bold text-yellow-600">{countByStatus("in-progress")}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Completed</h3>
          <p className="text-2xl font-bold text-purple-600">{countByStatus("completed")}</p>
        </div>
      </div>

      {/* No data */}
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No enrolled students found</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg mt-10">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-r border-indigo-500">
                    Agreement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Enrolled Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((en) => (
                  <tr key={en.enrollment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {en.enrollment_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {en.student?.username || en.student?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {en.course?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          en.status === "enrolled"
                            ? "bg-green-100 text-green-800"
                            : en.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : en.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {en.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm border-r border-gray-200">
                      {en.useragreement ? (
                        <button
                          onClick={() => viewAgreement(en)}
                          className="text-blue-600 hover:text-blue-800 underline text-xs"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">No Agreement</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(en.enrollment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4 mt-10">
            {filtered.map((en) => (
              <div
                key={en.enrollment_id}
                className="bg-white border border-gray-200 rounded-lg shadow p-4"
              >
                <p className="text-sm">
                  <strong>ID:</strong> {en.enrollment_id}
                </p>
                <p className="text-sm">
                  <strong>Name:</strong>{" "}
                  {en.student?.username || en.student?.name || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Course:</strong> {en.course?.title || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      en.status === "enrolled"
                        ? "bg-green-100 text-green-800"
                        : en.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : en.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {en.status || "Pending"}
                  </span>
                </p>
                <div className="mt-2">
                  <strong>Agreement:</strong>{" "}
                  {en.useragreement ? (
                    <button
                      onClick={() => viewAgreement(en)}
                      className="ml-1 text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                    >
                      View
                    </button>
                  ) : (
                    <span className="ml-1 text-gray-400">No Agreement</span>
                  )}
                </div>
                <p className="text-sm mt-2">
                  <strong>Date:</strong>{" "}
                  {new Date(en.enrollment_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnrolledStudents;
