'use client';

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import dayjs from "dayjs";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface FeedbackClientProps {
    interviewId: string;
    interview: {
        role: string;
    };
}

const FeedbackClient = ({ interviewId, interview }: FeedbackClientProps) => {
    const user = useUser();
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (user?.id) {
                const result = await getFeedbackByInterviewId({ interviewId, userId: user.id });
                setFeedback(result);
                setLoading(false);
                console.log("Fetched Feedback:", result);
            }
        };
        fetchFeedback();
    }, [user, interviewId]);

    if (loading) return <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />;

    if (!feedback) return <p>No feedback available for this interview.</p>;

    const strengths = feedback?.strengths ? JSON.parse(feedback.strengths) : [];
    const areasForImprovement = feedback?.areas_for_improvement
        ? JSON.parse(feedback.areas_for_improvement)
        : [];


    return (
        <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 my-6">
            <div className="flex flex-row justify-center">
                <h1 className="text-4xl font-semibold">
                    Feedback on the Interview -{" "}
                    <AnimatedGradientText
                                        speed={2}
                                    >
                                        {interview.role} Interview
                                    </AnimatedGradientText>
                </h1>
            </div>

            <div className="flex flex-row justify-center">
                <div className="flex flex-row gap-5">
                    {/* Overall Impression */}
                    <div className="flex flex-row gap-2 items-center">
                        <Image src="/star.svg" width={22} height={22} alt="star" className="filter invert-0 brightness-0 contrast-100"/>
                        <p>
                            Overall Impression:{" "}
                            <span className="text-black font-bold">
                                {feedback?.total_score}
                            </span>
                            /100
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex flex-row gap-2">
                        <Image src="/calendar.svg" width={22} height={22} alt="calendar" className="filter invert-0 brightness-0 contrast-100"/>
                        <p>
                            {feedback?.created_at
                                ? dayjs(feedback.created_at).format("MMM D, YYYY h:mm A")
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <hr />

            <div className="bg-secondary rounded-3xl p-5">
            <p>{feedback?.final_assessment}</p>
            </div>

            {/* Interview Breakdown */}
            <div className="bg-secondary rounded-3xl p-5">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-semibold">Breakdown of the Interview:</h2>
                {feedback?.category_scores?.map((category: any, index: number) => (
                    <div key={index}>
                        <p className="font-bold">
                            {index + 1}. {category.name} ({category.score}/100)
                        </p>
                        <p>{category.comment}</p>
                    </div>
                ))}
            </div>
            </div>

            <div className="bg-secondary rounded-3xl p-5">
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold">Strengths</h3>
                <ul className="list-disc list-inside">
                    {strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                    ))}
                </ul>
            </div>
            </div>


            <div className="bg-secondary rounded-3xl p-5">
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold">Areas for Improvement</h3>
                <ul className="list-disc list-inside">
                    {areasForImprovement.map((area: string, index: number) => (
                        <li key={index}>{area}</li>
                    ))}
                </ul>
            </div>
            </div>


            <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center">
                <Button className="w-fit !bg-dark-200 !text-primary-200 hover:!bg-dark-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 flex-1">
                    <Link href="/dashboard" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-primary-200 text-center">
                            Back to dashboard
                        </p>
                    </Link>
                </Button>

                <Button className="w-fit !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !font-bold px-5 cursor-pointer min-h-10 flex-1">
                <Link
  href={{
    pathname: "/dashboard/interview/[id]",
    query: { id: interviewId },
  }}
  className="flex w-full justify-center"
>
  <p className="text-sm font-semibold text-white text-center">
    Retake Interview
  </p>
</Link>

                </Button>
            </div>
        </section>
    );
};

export default FeedbackClient;
