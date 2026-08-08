import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-3 text-gray-400"
        size={18}
      />

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Search..."
        className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-500"
      />
    </div>
  );
}
