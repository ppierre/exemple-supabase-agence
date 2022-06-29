<template>
  <div
    class="
      flex
      justify-center
      items-center
      relative
      gap-2
      px-4
      py-2.5
      rounded-lg
      bg-indigo-500
    "
  >
    <p
      class="flex-grow-0 flex-shrink-0 text-sm font-bold text-center text-white"
    >
      <slot />
    </p>
  </div>
</template>