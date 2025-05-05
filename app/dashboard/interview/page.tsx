'use client';

import { useUser } from "@stackframe/stack";
import Agent from "@/components/Agent";

const Page = () => {
    const user = useUser();

    if (!user) return null;

    return (
        <>
            <h3 className="text-2xl font-semibold my-5">Interview generation</h3>
            <Agent
                userName={user.displayName!}
                userId={user.id}
                profileImage={user.profileImageUrl}
                type="generate"
            />
        </>
    );
}

export default Page;