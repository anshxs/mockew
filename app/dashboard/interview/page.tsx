'use client';

import { useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

import {
  
  Button,
} from "@/components/ui/button";
import {Input} from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card,
    CardContent,
    CardHeader,
    CardTitle,} from "@/components/ui/card"
import { toast } from "sonner";

const Page = () => {
  const user = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    role: "",
    level: "",
    techstack: "",
    type: "",
    amount: "5",
  });

  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.role || !form.level || !form.techstack || !form.type || !form.amount) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          userid: user.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate questions");
      toast.success("Questions generated!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Hey {user.displayName}, let’s craft your mock interview!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Role</Label>
            <Input
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>

          <div>
            <Label>Experience Level</Label>
            <Input
              placeholder="e.g. Junior, Mid, Senior"
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
            />
          </div>

          <div>
            <Label>Tech Stack</Label>
            <Textarea
              placeholder="e.g. React, Node.js, MongoDB"
              value={form.techstack}
              onChange={(e) => handleChange("techstack", e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Input
              placeholder="e.g. technical, behavioural, balanced"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </div>

          <div>
            <Label>Number of Questions</Label>
            <Slider
    defaultValue={[parseInt(form.amount)]}
    min={1}
    max={10}
    step={1}
    onValueChange={(value) => handleChange("amount", value[0].toString())}
  />

          </div>

          <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate Interview"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
