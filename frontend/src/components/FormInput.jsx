export default function FormInput({ label, type = "text", name, value, onChange,readOnly, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      />
    </div>
  );
}
