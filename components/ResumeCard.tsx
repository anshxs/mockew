import Link from "next/link";
import { FileText } from "lucide-react";

export default function ResumeCard({ resume }: { resume: any }) {
  const getRandomColor = () => {
    const colors = [
      "#fee2e2",
      "#dbeafe",
      "#d1fae5",
      "#fef9c3",
      "#ede9fe",
      "#fce7f3",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Link href={`/dashboard/resume-build/${resume.id}`}>
      <div className="border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer">
        <div
  className="w-full h-40 rounded flex items-center justify-center"
  style={{ backgroundColor: getRandomColor() }}
>
  <FileText className="w-10 h-10 text-black" />
</div>

        <h2 className="mt-2 font-medium">{resume.title}</h2>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(resume.updated_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
