export default function GenerateWithAi({openModal}) {
    return (
        <button
            onClick={openModal}
           className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
        >
            Generate Resume with AI
        </button>
    );
}
