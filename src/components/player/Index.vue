<template>
  <div class="container" :class="containerClass" @click="vote">
    <div v-if="status === 'hidden'" class="card hidden">
      <img :src="require('@/assets/wolf_icon.svg')" width="40" class="img" />
    </div>
    <div v-else-if="status === 'shuffling'" class="card">
      <img :src="require('@/assets/shuffling.gif')" class="shuffling" />
    </div>
    <div v-else-if="status === 'visible'" class="card">
      <span class="text--subtitle">{{
        $whim.state.userTopic[displayUser.id]
      }}</span>
    </div>
    <div v-else-if="status === 'wolf'" class="card wolf">
      <span class="text--subtitle">{{
        $whim.state.userTopic[displayUser.id]
      }}</span>
    </div>
    <div class="vote text--title" :class="voted ? 'voted' : ''">
      {{ voted ? "投票済み" : "投票する" }}
    </div>
    <div class="names">
      <div v-for="name in votedNames" :key="name" class="name">{{ name }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Player",
  props: {
    displayUser: Object
  },
  computed: {
    status() {
      if (this.$whim.state.phase === "shuffling") {
        return "shuffling";
      }
      if (
        (this.$whim.state.phase === "discussing" ||
          this.$whim.state.phase === "voting" ||
          this.$whim.state.phase === "disclosuring") &&
        this.$whim.accessUser === this.displayUser
      ) {
        return "visible";
      }

      if (this.$whim.state.phase === "result") {
        if (this.$whim.state.minorityUserId === this.displayUser.id) {
          return "wolf";
        } else {
          return "visible";
        }
      }
      return "hidden";
    },
    voted() {
      return (
        this.$whim.state.votes &&
        this.$whim.state.votes[this.$whim.accessUser.id] === this.displayUser.id
      );
    },
    votedNames() {
      const votes = this.$whim.state.votes;
      if (!votes || this.$whim.state.phase === "voting") {
        return [];
      }

      return Object.entries(votes)
        .filter(vote => vote[1] === this.displayUser.id)
        .map(vote => this.$whim.users.find(user => user.id === vote[0]).name);
    },
    containerClass() {
      if (this.$whim.state.phase === "voting") {
        if (this.voted) {
          return "voted";
        }
        if (
          this.$whim.state.votes &&
          this.$whim.state.votes[this.$whim.accessUser.id] !== undefined
        ) {
          return "";
        }
        return "voting";
      }
      return "";
    },
    votesLength() {
      return Object.keys(this.$whim.state.votes).length;
    }
  },
  methods: {
    vote() {
      if (this.$whim.state.phase === "voting" && !this.voted) {
        const votes = this.$whim.state.votes || {};
        votes[this.$whim.accessUser.id] = this.displayUser.id;
        this.$whim.assignState({
          votes: votes
        });
        // 終了判定
        if (this.votesLength >= this.$whim.users.length) {
          this.$whim.assignState({
            phase: "disclosuring"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vote {
  display: none;
  color: white;
}

.voted {
  background: rgba(0, 0, 0, 0.4);
  .vote {
    display: block;
  }
}

.voting {
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    .vote {
      display: block;
    }
  }
}

.card {
  margin: 80px auto;
  width: 300px;
  height: 50px;

  border-radius: 4px;
  position: relative;
  background: #ffffff;
  text-align: center;

  .shuffling {
    width: 300px;
    height: 50px;
  }
}

.hidden {
  background: #ffba49;
}
.wolf {
  background: #ffba49;
  color: white;
}

.img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto; /*上下左右中央に*/
  width: 40px; /*widthの指定は必須*/
  height: 40px; /*heightの指定は必須*/
}
.names {
  position: absolute;
  bottom: 0;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}
.name {
  background: rgba(256, 256, 256, 0.4);
  border-radius: 8px;
  border: medium solid #000000;
  margin: 0px;
  font-size: 20px;
  width: 200px;
}
</style>
