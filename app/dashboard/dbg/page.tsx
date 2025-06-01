"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import MDEditor from "@uiw/react-md-editor"
import Link from "next/link"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useUser } from "@stackframe/stack"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send } from "lucide-react"

dayjs.extend(relativeTime)

type Post = {
  id: string
  content: string
  username: string
  userimage: string
  created_at: string
  likes_count?: number
  user_has_liked?: boolean
}

type Comment = {
  id: string
  post_id: string
  username: string
  userimage: string
  content: string
  created_at: string
}

export default function FeedPage() {
  const user = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editorValue, setEditorValue] = useState("")
  const [likesLoading, setLikesLoading] = useState<Record<string, boolean>>({})
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [commentText, setCommentText] = useState("")
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({})
  const [openCommentsSheet, setOpenCommentsSheet] = useState<string | null>(null)

  const fetchPosts = async () => {
    // Get all posts first (your original query)
    const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

    if (!postsData) return

    // If user is logged in, get like information
    if (user?.id) {
      // Get like counts for all posts
      const { data: likeCounts } = await supabase
        .from("post_likes")
        .select("post_id")
        .in(
          "post_id",
          postsData.map((post) => post.id),
        )

      // Get user's likes
      const { data: userLikes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in(
          "post_id",
          postsData.map((post) => post.id),
        )

      // Process posts with like information
      const processedPosts = postsData.map((post) => {
        const likesCount = likeCounts?.filter((like) => like.post_id === post.id).length || 0
        const userHasLiked = userLikes?.some((like) => like.post_id === post.id) || false

        return {
          ...post,
          likes_count: likesCount,
          user_has_liked: userHasLiked,
        }
      })

      setPosts(processedPosts)
    } else {
      // If no user, just set posts without like information
      setPosts(
        postsData.map((post) => ({
          ...post,
          likes_count: 0,
          user_has_liked: false,
        })),
      )
    }
  }

  const getUsernameFromEmail = (email: string): string => {
    if (!email || !email.includes("@")) throw new Error("Invalid email format")
    return email.split("@")[0]
  }

  const handlePost = async () => {
    const username = getUsernameFromEmail(user?.primaryEmail ?? "")

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("image")
      .eq("username", username)
      .single()

      const { data: profileData, error: fetchExpError } = await supabase
      .from("profiles")
      .select("experience")
      .eq("id", user?.id)
      .single();

    if (fetchExpError) {
      console.error("Failed to fetch latest experience:", fetchExpError);
      return;
    }

    const newExperience = (profileData?.experience ?? 0) + 1;

    const { error: experror } = await supabase
      .from("profiles")
      .update({ experience: newExperience })
      .eq("id", user?.id);

    if (experror) {
      console.error("Failed to update experience:", experror);
      return;
    }

    if (userError || !userData) {
      console.error("Failed to fetch user image:", userError)
      return
    }

    const { error: insertError } = await supabase.from("posts").insert({
      content: editorValue,
      username,
      userimage: userData.image,
    })

    if (insertError) {
      console.error("Failed to insert post:", insertError)
      return
    }

    setEditorValue("")
    setOpenDialog(false)
    fetchPosts()
  }

  const handleLike = async (postId: string) => {
    if (!user?.id) return

    // Set loading state for this specific post
    setLikesLoading((prev) => ({ ...prev, [postId]: true }))

    try {
      // Check if the user has already liked this post
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single()

      if (existingLike) {
        // User has already liked the post, so unlike it
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id)

        // Update local state
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: (post.likes_count || 0) - 1,
                  user_has_liked: false,
                }
              : post,
          ),
        )
      } else {
        // User hasn't liked the post yet, so like it
        await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user.id,
        })

        const { data: profileData, error: fetchExpError } = await supabase
      .from("profiles")
      .select("experience")
      .eq("id", user?.id)
      .single();

    if (fetchExpError) {
      console.error("Failed to fetch latest experience:", fetchExpError);
      return;
    }

    const newExperience = (profileData?.experience ?? 0) + 0.5;

    const { error: experror } = await supabase
      .from("profiles")
      .update({ experience: newExperience })
      .eq("id", user?.id);

    if (experror) {
      console.error("Failed to update experience:", experror);
      return;
    }

        // Update local state
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: (post.likes_count || 0) + 1,
                  user_has_liked: true,
                }
              : post,
          ),
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      // Clear loading state
      setLikesLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const fetchComments = async (postId: string) => {
    if (comments[postId]) return // Already loaded

    setCommentsLoading((prev) => ({ ...prev, [postId]: true }))

    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (commentsData) {
      setComments((prev) => ({ ...prev, [postId]: commentsData }))
      
    }

    setCommentsLoading((prev) => ({ ...prev, [postId]: false }))
  }

  const handleComment = async (postId: string) => {
    if (!user?.primaryEmail || !commentText.trim()) {
      console.log("Missing user email or comment text")
      return
    }

    const username = getUsernameFromEmail(user.primaryEmail)
    console.log("Attempting to add comment:", { postId, username, commentText: commentText.trim() })

    try {
      // First, verify the post exists
      const { data: postExists, error: postError } = await supabase.from("posts").select("id").eq("id", postId).single()

      if (postError || !postExists) {
        console.error("Post not found:", postError)
        alert("Error: Post not found")
        return
      }

      // Get the user image
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("image")
        .eq("username", username)
        .single()

      if (userError) {
        console.error("Failed to fetch user image:", userError)
        // Continue with placeholder image instead of failing
      }

      const userImage = userData?.image || "/placeholder.svg"
      console.log("User data:", { username, userImage })

      // Check if comments table exists and we can read from it
      const { data: testRead, error: readError } = await supabase.from("comments").select("id").limit(1)

      if (readError) {
        console.error("Cannot read from comments table:", readError)
        alert("Error: Cannot access comments table")
        return
      }

      // Prepare the comment data
      const commentData = {
        post_id: postId,
        username: username,
        userimage: userImage,
        content: commentText.trim(),
      }

      console.log("Inserting comment with data:", commentData)

      // Insert the comment
      const { data: newComment, error: insertError } = await supabase.from("comments").insert(commentData).select()
      const { data: profileData, error: fetchExpError } = await supabase
      .from("profiles")
      .select("experience")
      .eq("id", user?.id)
      .single();

    if (fetchExpError) {
      console.error("Failed to fetch latest experience:", fetchExpError);
      return;
    }

    const newExperience = (profileData?.experience ?? 0) + 0.5;

    const { error: experror } = await supabase
      .from("profiles")
      .update({ experience: newExperience })
      .eq("id", user?.id);

    if (experror) {
      console.error("Failed to update experience:", experror);
      return;
    }

      console.log("Insert result:", { newComment, insertError })

      if (insertError) {
        console.error("Failed to insert comment:", insertError)
        alert(`Error inserting comment: ${insertError.message}`)
        return
      }

      // Update local state if we have a successful comment
      if (newComment && newComment.length > 0) {
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment[0]],
        }))
        setCommentText("")
        console.log("Comment added successfully")
      } else {
        console.error("No comment returned from insert")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      alert(`Unexpected error: ${error}`)
    }
  }

  const openComments = (postId: string) => {
    setOpenCommentsSheet(postId)
    fetchComments(postId)
  }

  const checkAuthStatus = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    console.log("Auth session:", session)
    console.log("Auth error:", error)
    console.log("User from Stack:", user)
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [user])

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <div className="w-[500px] max-w-full bg-[#FFFFFF] mt-8 flex flex-col h-screen">
        {/* Sticky Header */}
        <div className="flex items-center gap-2 border-t-2 border-x-2 rounded-t-3xl px-4 py-4 sticky top-0 bg-[#FAFAFA] z-10">
          <img src={user?.profileImageUrl ?? ""} className="w-10 h-10 rounded-full" />
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 px-4 py-2 border rounded-full"
            onFocus={() => setOpenDialog(true)}
          />
          <Button onClick={() => setOpenDialog(true)} className="px-4 py-2">
            Post
          </Button>
        </div>

        {/* Post Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[500px] rounded-3xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <button onClick={() => setOpenDialog(false)}>Cancel</button>
                <h2 className="font-bold">New Post</h2>
                <div className="w-16" />
              </div>
              <div className="flex gap-2 items-start">
                <img src={user?.profileImageUrl ?? ""} className="w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                  <span className="font-semibold">{getUsernameFromEmail(user?.primaryEmail ?? "")}</span>
                  <MDEditor value={editorValue} onChange={(value) => setEditorValue(value ?? "")} />
                </div>
              </div>
              <Button onClick={handlePost} className="w-full">
                Post
              </Button>
            </div>
          </div>
        )}

        {/* Scrollable Feed */}
        <ScrollArea className="flex-1 overflow-y-auto px-4 pt-4 bg-[#FAFAFA] border-x-2">
          <div className="space-y-6 pb-6">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border-b space-y-2">
                <div className="flex items-center gap-3">
                  <Link href={`/${post.username}`}>
                    <img src={post.userimage || "/placeholder.svg"} className="w-10 h-10 rounded-full cursor-pointer" />
                  </Link>
                  <div>
                    <Link href={`/${post.username}`}>
                      <p className="font-bold">{post.username}</p>
                    </Link>
                    <p className="text-sm text-gray-500">{dayjs(post.created_at).fromNow()}</p>
                  </div>
                </div>
                <div className="prose ml-8 prose-sm">
                  <MDEditor.Markdown source={post.content} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likesLoading[post.id]}
                    className="flex items-center gap-1"
                  >
                    <Heart className={`w-4 h-4 ${post.user_has_liked ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{post.likes_count || 0}</span>
                  </button>
                  <Sheet
                    open={openCommentsSheet === post.id}
                    onOpenChange={(open) => setOpenCommentsSheet(open ? post.id : null)}
                  >
                    <SheetTrigger asChild>
                      <button onClick={() => openComments(post.id)} className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="rounded-r-3xl my-2">
                      <div className="flex flex-col h-full">
                        <SheetHeader className="p-4 border-b">
                          <SheetTitle className="text-center">Comments</SheetTitle>
                        </SheetHeader>

                        {/* Comments List */}
                        <ScrollArea className="flex-1 p-4">
                          {commentsLoading[post.id] ? (
                            <div className="text-center py-4">Loading comments...</div>
                          ) : comments[post.id]?.length > 0 ? (
                            <div className="space-y-4">
                              {comments[post.id].map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <img
                                    src={comment.userimage || "/placeholder.svg"}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm">{comment.username}</span>
                                      <span className="text-xs text-gray-500">
                                        {dayjs(comment.created_at).fromNow()}
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No comments yet. Be the first to comment!
                            </div>
                          )}
                        </ScrollArea>

                        {/* Comment Input */}
                        {user?.primaryEmail && (
                          <div className="p-4 border-t bg-white">
                            <div className="flex gap-3 items-center">
                              <img
                                src={user.profileImageUrl || "/placeholder.svg"}
                                className="w-8 h-8 rounded-full flex-shrink-0"
                              />
                              <div className="flex-1 flex gap-2">
                                <Input
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Add a comment..."
                                  className="flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault()
                                      handleComment(post.id)
                                    }
                                  }}
                                />
                                <Button size="sm" onClick={() => handleComment(post.id)} disabled={!commentText.trim()}>
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
