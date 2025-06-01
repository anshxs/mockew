"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCheckIcon,
  CheckCircle,
  ChevronDown,
  Circle,
  FileIcon,
  FileText,
  LucideGithub,
  LucideInstagram,
  LucideMail,
  Star,
} from "lucide-react";
import { useUser } from "@stackframe/stack";
import supabase from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Resume } from "@/types/resume";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { DeveloperResumeCard } from "@/components/GitResume";

type Profile = {
  id: string;
  name: string | null;
  username: string;
  bio: string | null;
  github: string | null;
  instagram: string | null;
  email: string | null;
  image: string | null;
  experience: number | null;
  showResume: boolean;
  showAchievements: boolean;
  showLinks: boolean;
  showMockroom: boolean;
  plan: "Free" | "Paid" | "Sponsored";
};

type ShortLinksListProps = {
  linkIds: string[];
};

export default function UserProfilePage() {
  const user = useUser();
  const params = useParams();
  const username = params?.username as string;
    const [shortLinks, setShortLinks] = useState<{ [id: string]: string }>({});

  

  if (!username) {
    return <div className="p-8 text-center">Username not found</div>;
  }

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [resumes, setResumes] = useState<Resume[]>([]);
  const isOwner = user && profile && user.id === profile.id;
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
 const [links, setLinks] = useState<string[]>([]);
 

 const getLevelFromExperience = (experience: number): number => {
  let level = 0;
  let threshold = 2;

  while (experience >= threshold) {
    level++;
    threshold *= 2;
  }

  return level;
};
const level = getLevelFromExperience(profile?.experience ?? 0);

 useEffect(() => {
    const fetchTinyUrls = async () => {
      const results: { [id: string]: string } = {};

      await Promise.all(
        links.map(async (id) => {
          const fullUrl = `https://mockewai.vercel.app/link/${id}`;
          try {
            const response = await fetch(
              `https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`
            );
            const tinyUrl = await response.text();
            results[id] = tinyUrl;
          } catch {
            results[id] = fullUrl; // fallback to full URL if TinyURL fails
          }
        })
      );

      setShortLinks(results);
    };

    fetchTinyUrls();
  }, [links]);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Copied to clipboard!");
    });
  };

 useEffect(() => {
    const fetchUserLinks = async () => {

      // Step 2: Fetch links where user_id === user.id
      const { data, error } = await supabase
        .from('links')
        .select('id, user_id')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching links:', error);
        return;
      }

      // Step 3: Extract and save the link IDs
      const linkIds = (data || []).map((link) => link.id);
      setLinks(linkIds);
    };

    fetchUserLinks();
  }, []);

  useEffect(() => {
    const checkFollowing = async () => {
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", user?.id) // Current user
        .eq("following_id", profile?.id); // Profile being viewed

      if (data && data.length > 0) {
        setIsFollowing(true);
      }
    };

    if (!isOwner && user?.id && profile?.id) {
      checkFollowing();
    }
  }, [user?.id, profile?.id, isOwner]);

  const handleFollow = async () => {
    const { error } = await supabase.from("followers").insert({
      follower_id: user?.id,
      following_id: profile?.id,
    });

    if (!error) {
      setIsFollowing(true);
      setFollowers((prev) => prev + 1); // Immediately update count
    }
  };

  const handleResumeClick = async (resume: Resume) => {
    setOpenSummaryDialog(true);
    setLoadingSummary(true);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: JSON.stringify(resume) }),
      });

      const { result } = await response.json();
      setSummaryText(result || "No summary available.");
    } catch (err) {
      setSummaryText("Failed to generate summary. Please try again.");
      console.error("Error fetching summary:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleUnfollow = async () => {
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", user?.id)
      .eq("following_id", profile?.id);

    if (!error) {
      setIsFollowing(false);
      setDropdownOpen(false);
      setFollowers((prev) => Math.max(0, prev - 1)); // Safely decrease
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (data) {
        setProfile(data);
        setForm(data);

        const [{ count: fCount }, { count: fwingCount }] = await Promise.all([
          supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("following_id", data.id),
          supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", data.id),
        ]);

        setFollowers(fCount || 0);
        setFollowing(fwingCount || 0);
      }
    };

    fetchData();
  }, [username]);

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        bio: form.bio,
        github: form.github,
        instagram: form.instagram,
        email: form.email,
        showResume: form.showResume,
        showAchievements: form.showAchievements,
        showMockroom: form.showMockroom,
        showLinks: form.showLinks,
        plan: form.plan,
      })
      .eq("id", profile.id);

    if (!error) {
      setProfile({ ...profile, ...form } as Profile);
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      if (!profile?.showResume) return;

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", profile.id);

      if (data) {
        setResumes(data as Resume[]);
      }
    };

    fetchResumes();
  }, [profile?.id, profile?.showResume]);

  if (!profile) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-center gap-6 border-b-dashed border-b-2 pb-6 mb-8">
          {/* Left: Image */}
          <div className="flex-shrink-0">
            {profile.image ? (
              <Image
                src={profile.image}
                alt="Profile"
                width={120}
                height={120}
                unoptimized
                className="rounded-full"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-300" />
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-row sm:flex-col md:flex-row items-start sm:items-start gap-16">
            <div className="md:border-x-gray-400 md:border-dashed md:border-x-2 sm:px-4 md:px-8">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.name}
                {profile.plan === "Paid" && (
                  <svg
                    className="w-5 h-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M11.5283 1.5999C11.7686 1.29437 12.2314 1.29437 12.4717 1.5999L14.2805 3.90051C14.4309 4.09173 14.6818 4.17325 14.9158 4.10693L17.7314 3.3089C18.1054 3.20292 18.4799 3.475 18.4946 3.86338L18.6057 6.78783C18.615 7.03089 18.77 7.24433 18.9984 7.32823L21.7453 8.33761C22.1101 8.47166 22.2532 8.91189 22.0368 9.23478L20.4078 11.666C20.2724 11.8681 20.2724 12.1319 20.4078 12.334L22.0368 14.7652C22.2532 15.0881 22.1101 15.5283 21.7453 15.6624L18.9984 16.6718C18.77 16.7557 18.615 16.9691 18.6057 17.2122L18.4946 20.1366C18.4799 20.525 18.1054 20.7971 17.7314 20.6911L14.9158 19.8931C14.6818 19.8267 14.4309 19.9083 14.2805 20.0995L12.4717 22.4001C12.2314 22.7056 11.7686 22.7056 11.5283 22.4001L9.71949 20.0995C9.56915 19.9083 9.31823 19.8267 9.08421 19.8931L6.26856 20.6911C5.89463 20.7971 5.52014 20.525 5.50539 20.1366L5.39427 17.2122C5.38503 16.9691 5.22996 16.7557 5.00164 16.6718L2.25467 15.6624C1.88986 15.5283 1.74682 15.0881 1.96317 14.7652L3.59221 12.334C3.72761 12.1319 3.72761 11.8681 3.59221 11.666L1.96317 9.23478C1.74682 8.91189 1.88986 8.47166 2.25467 8.33761L5.00165 7.32823C5.22996 7.24433 5.38503 7.03089 5.39427 6.78783L5.50539 3.86338C5.52014 3.475 5.89463 3.20292 6.26857 3.3089L9.08421 4.10693C9.31823 4.17325 9.56915 4.09173 9.71949 3.90051L11.5283 1.5999Z"
                          stroke="#0061ff"
                          stroke-width="3"
                        ></path>{" "}
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="#0061ff"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </svg>
                )}
                {profile.plan === "Sponsored" && (
                  <svg
                    className="w-5 h-5 text-[#ffc800]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M11.5283 1.5999C11.7686 1.29437 12.2314 1.29437 12.4717 1.5999L14.2805 3.90051C14.4309 4.09173 14.6818 4.17325 14.9158 4.10693L17.7314 3.3089C18.1054 3.20292 18.4799 3.475 18.4946 3.86338L18.6057 6.78783C18.615 7.03089 18.77 7.24433 18.9984 7.32823L21.7453 8.33761C22.1101 8.47166 22.2532 8.91189 22.0368 9.23478L20.4078 11.666C20.2724 11.8681 20.2724 12.1319 20.4078 12.334L22.0368 14.7652C22.2532 15.0881 22.1101 15.5283 21.7453 15.6624L18.9984 16.6718C18.77 16.7557 18.615 16.9691 18.6057 17.2122L18.4946 20.1366C18.4799 20.525 18.1054 20.7971 17.7314 20.6911L14.9158 19.8931C14.6818 19.8267 14.4309 19.9083 14.2805 20.0995L12.4717 22.4001C12.2314 22.7056 11.7686 22.7056 11.5283 22.4001L9.71949 20.0995C9.56915 19.9083 9.31823 19.8267 9.08421 19.8931L6.26856 20.6911C5.89463 20.7971 5.52014 20.525 5.50539 20.1366L5.39427 17.2122C5.38503 16.9691 5.22996 16.7557 5.00164 16.6718L2.25467 15.6624C1.88986 15.5283 1.74682 15.0881 1.96317 14.7652L3.59221 12.334C3.72761 12.1319 3.72761 11.8681 3.59221 11.666L1.96317 9.23478C1.74682 8.91189 1.88986 8.47166 2.25467 8.33761L5.00165 7.32823C5.22996 7.24433 5.38503 7.03089 5.39427 6.78783L5.50539 3.86338C5.52014 3.475 5.89463 3.20292 6.26857 3.3089L9.08421 4.10693C9.31823 4.17325 9.56915 4.09173 9.71949 3.90051L11.5283 1.5999Z"
                          stroke="#ffc800"
                          stroke-width="3"
                        ></path>{" "}
                        <path
                          d="M9 12L11 14L15 10"
                          stroke="#ffc800"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </svg>
                )}
              </h1>
              <p className="text-gray-500">@{profile.username}</p>
              {profile.bio && <p className="text-xs">{profile.bio}</p>}
              {/* Socials */}
              <div className="mt-3 space-y-1 flex flex-row gap-2 text-sm ">
                {profile.github && (
                  <Link
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                  >
                    <LucideGithub className="inline text-white bg-black rounded-full w-8 h-8 pt-2" />
                  </Link>
                )}
                {profile.instagram && (
                  <div className="w-8 h-8 bg-gradient-to-br items-center justify-center flex from-blue-600 via-pink-500 to-red-500 rounded-md p-1">
                    <Link
                      href={`https://instagram.com/${profile.instagram}`}
                      target="_blank"
                    >
                      <LucideInstagram className="text-white w-5 h-5" />
                    </Link>
                  </div>
                )}
                {profile.email && (
                  <div className="w-8 h-8 items-center justify-center flex bg-gradient-to-b from-blue-600 to-blue-300 rounded-md p-1">
                    <Link href={`mailto:${profile.email}`} target="_blank">
                      <LucideMail className="text-white w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end sm:items-start mt-2 sm:mt-0">
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-black">
                    {followers}
                  </span>
                  <span>Followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-black">
                    {following}
                  </span>
                  <span>Following</span>
                </div>
                <div className="flex flex-col">
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-black">
                    {level || 0}
                  </span>
                  <span>Level</span>
                </div>
                <div className="flex gap-1 text-[9px]">
                    {profile.experience || 0}
                  <span>Experience</span>
                </div>
                </div>
              </div>

              {/* Edit Button and Dialog */}
              {isOwner ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="mt-2">
                      Edit Profile
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Your Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Name</Label>
                      <Input
                        value={form.name || ""}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Name"
                      />

                      <Label className="text-sm font-medium">Bio</Label>
                      <Textarea
                        value={form.bio || ""}
                        onChange={(e) =>
                          setForm({ ...form, bio: e.target.value })
                        }
                        placeholder="Bio"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        GitHub Username
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-500">
                          https://github.com/
                        </span>
                        <Input
                          value={form.github || ""}
                          onChange={(e) =>
                            setForm({ ...form, github: e.target.value })
                          }
                          placeholder="username"
                        />
                      </div>

                      <Label className="text-sm font-medium">Instagram</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-500">
                          https://instagram.com/
                        </span>
                        <Input
                          value={form.instagram || ""}
                          onChange={(e) =>
                            setForm({ ...form, instagram: e.target.value })
                          }
                          placeholder="yourhandle"
                        />
                      </div>

                      <Label className="text-sm font-medium">Email</Label>
                      <Input
                        type="email"
                        value={form.email || ""}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                      />
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex flex-row">
                          <Label className="text-sm font-medium">
                            Show Resume Summary
                          </Label>
                          <Input
                            type="checkbox"
                            checked={form.showResume || false}
                            onChange={(e) =>
                              setForm({ ...form, showResume: e.target.checked })
                            }
                          />
                        </div>
                        <div className="flex flex-row">
                          <Label className="text-sm font-medium">
                            Show Links
                          </Label>
                          <Input
                            type="checkbox"
                            checked={form.showLinks || false}
                            onChange={(e) =>
                              setForm({ ...form, showLinks: e.target.checked })
                            }
                          />
                        </div>
                        <div className="flex flex-row">
                          <Label className="text-sm font-medium">
                            Show Achievements
                          </Label>
                          <Input
                            type="checkbox"
                            checked={form.showAchievements || false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                showAchievements: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-row">
                          <Label className="text-sm font-medium">
                            Show Mockroom
                          </Label>
                          <Input
                            type="checkbox"
                            checked={form.showMockroom || false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                showMockroom: e.target.checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        onClick={() => {
                          handleSave();
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="relative">
                  {!isFollowing ? (
                    <Button size="sm" onClick={handleFollow} className="mt-2">
                      Follow
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        className="mt-2 border-2"
                        variant={"secondary"}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        Following
                        <ChevronDown className="ml-1 w-4 h-4" />
                      </Button>

                      {dropdownOpen && (
                        <div className="absolute mt-1 w-32 bg-white border rounded shadow z-10">
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                            onClick={handleUnfollow}
                          >
                            Unfollow
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-10 space-y-8">
          {profile.showResume && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Resume Summaries</h2>
              <div className="overflow-x-auto py-4">
                <div className="flex gap-4">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="min-w-[250px] bg-secondary border-2 rounded-lg p-4 cursor-pointer transition"
                      onClick={() => handleResumeClick(resume)}
                    >
                      <FileText />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {resume.designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {profile.showLinks && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Links</h2>
              <ul className="space-y-2">
      {links.map((id) => {
        const shortUrl = shortLinks[id] || "Loading...";
        return (
          <li key={id} className="flex items-center gap-2 mt-2">
            <span className="text-blue-600 underline">{shortUrl}</span>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
            <button
              onClick={() => window.open(shortUrl, "_blank")}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Open
            </button>
          </li>
        );
      })}
    </ul>
            </div>
          )}
          {profile.showAchievements && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Achievements</h2>
              <div className="text-gray-500 italic">Coming soon.</div>
            </div>
          )}
          {profile.showMockroom && (
            <div>
              <h2 className="text-lg font-semibold mb-1">My Mockroom</h2>
              <div className="text-gray-500 italic">Coming soon.</div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="min-h-screen rounded-4xl">
        <DeveloperResumeCard
          githubUsername={profile.github ?? ""}
          instagramHandle={profile.instagram ?? ""}
          email={profile.email ?? ""}
        />
      </div> */}
      {openSummaryDialog && (
        <Dialog open={openSummaryDialog} onOpenChange={setOpenSummaryDialog}>
          <DialogContent className="h-[400px] overflow-auto">
            <DialogDescription>
              <div>
                {loadingSummary ? (
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">
                      Analyzing Resume...
                    </p>
                    <div className="animate-spin h-8 w-8 rounded-full mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">Resume Summary</h2>
                    <MarkdownRenderer
                      content={summaryText ?? ""}
                    ></MarkdownRenderer>
                    <Button
                      onClick={() => setOpenSummaryDialog(false)}
                      variant={"secondary"}
                    >
                      Close
                    </Button>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
