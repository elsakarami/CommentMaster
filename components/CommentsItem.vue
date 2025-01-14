<template>
  <article class="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
    <p class="text-gray-500 dark:text-gray-400">
      {{ comment.content }} id={{ comment.id }} parent={{ comment.parentId }}
    </p>
    <button
      @click="showReplyForm = !showReplyForm"
      key=""
      class="flex py-4 items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
    >
      <svg
        class="mr-1.5 w-3.5 h-3.5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 18"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
        />
      </svg>
      Reply
    </button>
    <form v-if="showReplyForm" @submit.prevent="submitReply">
      <div
        class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <textarea
          v-model="replyContent"
          placeholder="Write a reply"
          class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
      >
        Post Reply
      </button>
    </form>
    <div>
      <CommentsItem
        v-for="child in comment?.children"
        :key="child.id"
        class="child-comment"
        :comment="child"
        @addReply="handleAddReply"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps, defineEmits, defineComponent } from "vue";

interface Comment {
  id: number;
  content: string;
  parentId: number | null;
  children: Comment[];
}

defineComponent({ name: "CommentsItem" });

const props = defineProps<{
  comment: Comment;
}>();

const emit = defineEmits<{
  (event: "addReply", parentId: number, replyContent: string): void;
}>();

const replyContent = ref<string>("");
const showReplyForm = ref<boolean>(false);

function submitReply(): void {
  if (replyContent.value.trim()) {
    emit("addReply", props.comment.id, replyContent.value);
    replyContent.value = "";
    showReplyForm.value = false;
  }
}

function handleAddReply(parentId: number, replyContent: string) {
  emit("addReply", parentId, replyContent);
}
</script>
