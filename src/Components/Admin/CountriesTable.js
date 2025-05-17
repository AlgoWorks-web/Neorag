import { FaArrowRight } from 'react-icons/fa';

const CountriesTable = () => {
  const countries = [
    { name: "United States", percentage: "65%" },
    { name: "UK", percentage: "15.7%" },
    { name: "Russia", percentage: "5.6%" },
    { name: "Spain", percentage: "2.1%" },
    { name: "India", percentage: "1.9%" },
    { name: "France", percentage: "1.5%" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h5 className="font-bold text-lg mb-4">Countries</h5>
      <table className="w-full border-collapse">
        <tbody>
          {countries.map((country, index) => (
            <tr key={index} className={index < countries.length - 1 ? "border-b" : ""}>
              <td className="py-2">{country.name}</td>
              <td className="py-2">{country.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
        More Countries <FaArrowRight className="inline ml-1" />
      </button>
    </div>
  );
};

export default CountriesTable;