<template>
  <input type="text" :value="value" @input="update" @blur="$emit('blur')" @keyup.enter="$emit('enter')">
</template>

<script>
export default {
  name: "FormInput",
  props: {
    value: {
      type: String
    }
  },
  methods: {
    update(e) {
      this.$emit('input', e.target.value);
    }
  }
}
</script>

<style scoped>

</style>