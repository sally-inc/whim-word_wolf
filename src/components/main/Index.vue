<template>
  <div>
    <Shuffling v-if="phase === 'shuffling'" />
    <Discussing v-else-if="phase === 'discussing'" />
    <Voting v-else-if="phase === 'voting'" />
    <Disclosuring v-else-if="phase === 'disclosuring'" />
    <Result v-else-if="phase === 'result'" />
    <GenreSelection v-else />
  </div>
</template>
<script>
import { Howl } from "howler";
const SE = new Howl({ src: require("@/assets/wolf.wav") });
export default {
  name: "Main",
  components: {
    GenreSelection: () => import("@/components/main/GenreSelection"),
    Shuffling: () => import("@/components/main/Shuffling"),
    Discussing: () => import("@/components/main/Discussing"),
    Disclosuring: () => import("@/components/main/Disclosuring"),
    Voting: () => import("@/components/main/Voting"),
    Result: () => import("@/components/main/Result")
  },
  computed: {
    phase() {
      return this.$whim.state.phase;
    },
    sound() {
      return this.$whim.state.sound;
    }
  },
  watch: {
    sound: function(newSound, oldSound) {
      if (newSound && !oldSound) {
        SE.volume(0.1);
        SE.play();
        setTimeout(() => {
          this.$whim.assignState({
            sound: null
          });
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
