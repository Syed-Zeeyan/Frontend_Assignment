'use client';

interface StatusFilterProps {
    selected: string;
    onChange: (status: string) => void;
}

const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Done' },
];

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onChange(filter.value)}
                    className={`
                        px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                        transition-all duration-200
                        ${selected === filter.value
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                    `}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
