"use client";

import { useState, useEffect } from "react";
import { Post } from "@/service/types";

interface ExtendedPost extends Post {
  disliked?: boolean;
  reactions?: {
    likes: number;
    dislikes: number;
  };
}

interface PostCardProps {
  post: ExtendedPost;
  isAuthenticated: boolean;
  onLike: (postId: number) => Promise<void>;
  onDislike: (postId: number) => void;
}

export default function PostCard({
  post,
  isAuthenticated,
  onLike,
  onDislike,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [disliked, setDisliked] = useState(post.disliked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLiked(post.liked);
    setDisliked(post.disliked);
  }, [post.liked, post.disliked]);

  async function handleLike() {
    if (!isAuthenticated) {
      alert("Você precisa estar autenticado para curtir posts!");
      return;
    }
    if (disliked) {
      alert("Você precisa remover o Dislike antes de poder curtir!");
      return;
    }

    setIsLoading(true);
    const previousLiked = liked;
    setLiked(!liked);

    try {
      await onLike(post.id);
    } catch {
      setLiked(previousLiked);
      alert("Erro ao curtir post. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleDislike() {
    if (!isAuthenticated) {
      alert("Você precisa estar autenticado para descurtir posts!");
      return;
    }
    if (liked) {
      alert("Você precisa remover o Like antes de poder descurtir!");
      return;
    }
    
    setDisliked(!disliked);
    onDislike(post.id);
  }

  return (
    <div
      role="listitem"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        marginBottom: "1rem",
        transition: "all 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "var(--card-hover)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "var(--card-bg)";
      }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "0.75rem",
          color: "var(--foreground)",
        }}
      >
        {post.title}
      </h2>

      <p
        style={{
          color: "var(--foreground)",
          opacity: 0.9,
          lineHeight: "1.6",
          marginBottom: "1rem",
        }}
      >
        {post.body}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "1rem",
          gap: "1rem",
        }}
      >
        {/* Botão de Like (Bloqueia se tiver Dislike) */}
        <button
          onClick={handleLike}
          disabled={isLoading || disliked}
          style={{
            background: liked ? "var(--secondary)" : "transparent",
            color: liked ? "white" : "var(--foreground)",
            border: `2px solid ${liked ? "var(--secondary)" : "var(--border)"}`,
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            cursor: (isLoading || disliked) ? "not-allowed" : "pointer",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s",
            opacity: (isLoading || disliked) ? 0.5 : 1, // Fica "apagado" se estiver bloqueado
          }}
          title={disliked ? "Remova o dislike primeiro" : "Curtir"}
        >
          <span style={{ fontSize: "1.1rem" }}>👍</span>
          <span>{post.reactions?.likes || 0} Likes</span>
        </button>

        {/* Botão de Dislike (Bloqueia se tiver Like) */}
        <button
          onClick={handleDislike}
          disabled={liked}
          style={{
            background: disliked ? "rgba(255, 0, 0, 0.1)" : "transparent",
            color: disliked ? "red" : "var(--foreground)",
            border: `2px solid ${disliked ? "red" : "var(--border)"}`,
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            cursor: liked ? "not-allowed" : "pointer",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s",
            opacity: liked ? 0.5 : 1, // Fica "apagado" se estiver bloqueado
          }}
          title={liked ? "Remova o like primeiro" : "Descurtir"}
        >
          <span style={{ fontSize: "1.1rem" }}>👎</span>
          <span>{post.reactions?.dislikes || 0} Dislikes</span>
        </button>
      </div>
    </div>
  );
}