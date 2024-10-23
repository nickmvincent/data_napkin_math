<template>
    <div class="tooltip-container" @click="toggleTooltip">
      <slot></slot>
      <div v-if="showTooltip" class="tooltip-content">
        {{ text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showTooltip: false
      };
    },
    methods: {
      toggleTooltip() {
        this.showTooltip = !this.showTooltip;
      }
    }
  };
  </script>
  
  <style scoped>
  .tooltip-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  
  .tooltip-content {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 3px;
    white-space: nowrap;
    font-size: 12px;
  }
  </style>
  