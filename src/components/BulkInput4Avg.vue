<template>
  <div>
    <textarea
      rows="5"
      class="time-input d-block rounded w-100 p-2"
      v-model="avgInputs"
    ></textarea>
    <button class="btn btn-avg mt-2 w-100" @click="calAvg">
      CALCULATE AVERAGE
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      avgInputs: "",
      totalBulkMin: 0, //totalBulkMin
    };
  },
  computed: {
    ...mapGetters(["getAllInputsArr", "password", "passCode"]),
  },
  methods: {
    ...mapActions([
      "getAllAvgInputs",
      "gatheringAllInputs",
      "minsFromAvgBox",
      "getAvg",
      "timeAdded",
    ]),
    calAvg() {
      if (this.password === this.passCode) {
        this.getAllAvgInputs(this.avgInputs);
        this.gatheringAllInputs();
        this.getTotalMinutes();
        this.minsFromAvgBox(this.totalBulkMin);
        this.getAvg();
        this.timeAdded();

        this.avgInputs = "";
      } else {
        alert("Abeer is not logged in");
      }
    },
    getTotalMinutes() {
      this.totalBulkMin = 0;
      if (this.getAllInputsArr.length) {
        this.getAllInputsArr.forEach((item) => {
          this.totalBulkMin += this.eachItemMin(item);
        });
      }
    },
    eachItemMin(item) {
      const regexHr = /[0-9]+(?=:)/g;
      const regexMin = /(?<=:)[0-9]+/g;

      let hr = Number(item.match(regexHr).join(""));
      let min = Number(item.match(regexMin).join(""));

      return hr * 60 + min;
    },
  },
};
</script>

<style scoped>
.time-input {
  font-family: "Roboto", sans-serif;
  font-size: 20px;
}
.btn-avg {
  font-family: "Fjalla One", sans-serif;
  font-size: 24px;
  border: 3px solid rgb(133, 133, 133);
  background: rgb(241, 241, 241);
}
</style>