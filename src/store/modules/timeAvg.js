export default {
  state() {
    return {
      totalMin4Avg: 0,
      totalDays: 0,
      avgTotalMin: 0,
      min4Avg: 0,
      hr4Avg: 0,
      targetAvgTime: 7,
      lastUpdate: '',
      isDateUpdated: true,

      // For Bulk Avg Box
      avgBoxInputs: '',
      regexTimes: /[0-9]+:[0-9]+/g,
      allInputsArr: [],
    };
  },
  mutations: {
    GET_ALL_AVG_INPUTS(state, allInputs) {
      state.avgBoxInputs = allInputs;
    },
    GATHERING_ALL_INPUTS(state) {
      if (state.allInputsArr.length) {
        state.allInputsArr = state.avgBoxInputs.match(state.regexTimes);
      }
      state.totalDays += state.allInputsArr.length;
    },
    MINS_FROM_AVG_BOX(state, mins) {
      state.totalMin4Avg += mins;
      state.isDateUpdated = false;
    },
    SINGLE_TIME_ADDING(state, singleTime) {
      state.isDateUpdated = false;
      if (singleTime) {
        state.totalMin4Avg += singleTime;
        state.totalDays++;
        alert('Added Successfully');
      }
    },
    GET_AVG(state) {

      if (state.totalMin4Avg) {
        let totalDays = state.totalDays;

        state.avgTotalMin = state.totalMin4Avg / totalDays;
        let minsPerDay = Math.round(state.avgTotalMin);
        let remainderMins = minsPerDay % 60;
        // remainderMins: minutes of eventual average time

        state.min4Avg = remainderMins;
        state.hr4Avg = (minsPerDay - remainderMins) / 60;
      } else {
        state.totalMin4Avg = 0;
      }
    },
    FETCH_DATA(state, payload) {
      state.totalMin4Avg = payload.totalMin;
      state.totalDays = payload.totalDays;
      state.lastUpdate = payload.lastUpdate;
    },
    UPDATE_DATE(state, payload) {
      state.lastUpdate = payload;
      state.isDateUpdated = true;
    }
  },
  actions: {
    getAllAvgInputs({ commit }, allInputs) {
      commit('GET_ALL_AVG_INPUTS', allInputs);
    },
    gatheringAllInputs({ commit }) {
      commit('GATHERING_ALL_INPUTS');
    },
    minsFromAvgBox({ commit }, mins) {
      commit('MINS_FROM_AVG_BOX', mins);
    },
    singleTimeAdding({ commit }, singleTime) {
      commit('SINGLE_TIME_ADDING', singleTime);
    },
    getAvg({ commit }) {
      commit('GET_AVG');
    },
    timeAdded(context) {
      let totalMin = context.rootGetters.totalMin4Avg;
      let totalDays = context.rootGetters.totalDays;

      fetch('https://time-calculator-abir-default-rtdb.firebaseio.com/time.json', {
        method: 'PUT',
        body: JSON.stringify({
          totalMin,
          totalDays
        })
      }).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error('Not added')
        }
      })
    },
    timeFetching(context) {
      let dayAndMin = {
        totalMin: null,
        totalDays: null,
        lastUpdate: null
      };
      fetch('https://time-calculator-abir-default-rtdb.firebaseio.com/time.json')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error('Not fetched')
          }
        }).then(data => {
          dayAndMin.totalMin = data.totalMin;
          dayAndMin.totalDays = data.totalDays;
        });

      fetch('https://time-calculator-abir-default-rtdb.firebaseio.com/date.json')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error('Not fetched');
          }
        }).then(data => {
          dayAndMin.lastUpdate = data.lastUpdate;
        });

      context.commit('FETCH_DATA', dayAndMin);
      context.commit('GET_AVG');
    },
    updateDate(context, payload) {
      context.commit('UPDATE_DATE', payload);
      let lastUpdate = context.rootGetters.lastUpdate;
      fetch('https://time-calculator-abir-default-rtdb.firebaseio.com/date.json', {
        method: 'PUT',
        body: JSON.stringify({
          lastUpdate
        })
      });

    },
    // doUpdateDate(context) {
    //   context.commit('DO_UPDATE_DATE');
    // }
  },
  getters: {
    getAllInputsArr(state) {
      return state.allInputsArr;
    },
    totalMin4Avg(state) {
      return state.totalMin4Avg;
    },
    totalDays(state) {
      return state.totalDays;
    },
    lastUpdate(state) {
      return state.lastUpdate;
    },
    isDateUpdated(state) {
      return state.isDateUpdated;
    },
    min4Avg(state) {
      return state.min4Avg;
    },
    hr4Avg(state) {
      return state.hr4Avg;
    },
    targetAvgTime(state) {
      return state.targetAvgTime;
    }
  }
}