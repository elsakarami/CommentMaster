<template>
  <section class="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
    <h1 class="pb-2 font-bold">Comments</h1>
    <form @submit.prevent="addComment">
      <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <label for="comment" class="sr-only pb-2">Your comment</label>
        <textarea id="comment" v-model="newComment" rows="6"
            class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
            placeholder="Write a comment..." required></textarea>
      </div>
      <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">Post Comment</button>
    </form>
    <div class="py-5">
      <CommentsItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @addReply="addReply"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { ref, watch, onMounted } from "vue";
import CommentsItem from "./CommentsItem.vue";

interface Comment {
  id: number;
  content: string;
  parentId: number | null;
  children: Comment[];
}

const { status, data, send } = useWebSocket<string>(
  `ws://localhost:3000/api/websocket`
);
const comments = ref<Comment[]>([]);
const newComment = ref<string>("");
let lastProcessedReplyId: number | null = null;

async function fetchComments(): Promise<void> {
  try {
    const response = await fetch("/comments.json");
    if (!response.ok) {
      throw new Error("Failed to fetch comments.");
    }
    const fetchedComments: Comment[] = await response.json();
    comments.value = fetchedComments;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

watch(data, (newData) => {
  if (newData) {
    const parsedData: Comment = JSON.parse(newData);

    if (parsedData.parentId !== null) {
      addReply(parsedData?.parentId, parsedData?.content);
    } else {
      comments.value.push({
        id: parsedData?.id,
        content: parsedData?.content,
        parentId: null,
        children: [],
      });
    }
  }
});

function addComment(): void {
  const newCommentObject: Comment = {
    id: Date.now(),
    content: newComment.value,
    parentId: null,
    children: [],
  };
  comments.value.push(newCommentObject);
  send(JSON.stringify(newCommentObject));
  newComment.value = "";
}

function addReply(parentId: number, replyContent: string): void {
  if (lastProcessedReplyId === parentId) {
    return;
  }

  const parentComment = findComment(comments.value, parentId);
  if (parentComment) {
    const newReply: Comment = {
      id: Date.now(),
      content: replyContent,
      parentId,
      children: [],
    };
    parentComment.children.push(newReply);
    send(JSON.stringify(newReply));
    lastProcessedReplyId = parentId;
  }
}

function findComment(commentsList: Comment[], commentId: number): Comment | null {
  for (let comment of commentsList) {
    if (comment.id === commentId) {
      return comment;
    }
    const childComment = findComment(comment.children, commentId);
    if (childComment) {
      return childComment;
    }
  }
  return null;
}

onMounted(fetchComments);
</script>
