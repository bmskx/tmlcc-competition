import TeamService from "../services/team.service";

export default {
  namespaced: true,
  state: {
    closeTime: new Date("October 3, 2021 00:00:00").getTime(),
    now: new Date().getTime(),
    teamList: [],
    currentTeam: {
      isLeader: false,
      team_id: "",
      teamName: "",
      members: [],
    },
    teamStatus: {
      hasTeam: false,
      status: "",
    },
    createStatus: {
      isInvalid: false,
      message: "",
    },
  },
  getters: {
    getTeamClose(state) {
      return state.now >= state.closeTime ? true : false;
    },
    getTeamList(state) {
      return state.teamList;
    },
    getTeamId(state) {
      return state.currentTeam.team_id;
    },
    getCurrentTeam(state) {
      return state.currentTeam;
    },
    getCurrentTeamMemberCount(state) {
      return state.currentTeam.members.filter(
        (member) => member.status == "approved"
      ).length;
    },
    getCurrentTeamMember(state, getters, rootState) {
      return state.currentTeam.members.filter((member) => {
        if (
          getters.getCurrentTeamMemberCount == 5 &&
          state.currentTeam.isLeader
        ) {
          return (
            member.member_id != rootState.auth.user.user_id &&
            member.status == "approved"
          );
        } else {
          return member.member_id != rootState.auth.user.user_id;
        }
      });
    },
    getTeamStatus(state) {
      return state.teamStatus;
    },
    getCreateStatus(state) {
      return state.createStatus;
    },
  },
  mutations: {
    resetCreateStatus(state) {
      state.createStatus.isInvalid = false;
      state.createStatus.message = "";
    },
    resetCurrentTeam(state) {
      state.currentTeam.isLeader = false;
      state.currentTeam.team_id = "";
      state.currentTeam.teamName = "";
      state.currentTeam.members = [];
    },
    resetTeamStatus(state) {
      state.teamStatus.hasTeam = false;
      state.teamStatus.status = "";
    },
    setInvalidTeamName(state, message) {
      state.createStatus.isInvalid = true;
      state.createStatus.message = message;
    },
    setTeamStatus(state, status) {
      state.teamStatus.hasTeam = true;
      state.teamStatus.status = status;
    },
    setCurrentTeam(state, team) {
      if (team.isLeader) {
        if (state.now >= state.closeTime) {
          team.members = team.members.filter(
            (member) => member.status == "approved"
          );
        }
        team.members = team.members.sort((a, b) => {
          let memberA = a.status;
          let memberB = b.status;

          let comparison = 0;
          if (memberA > memberB) {
            comparison = 1;
          } else if (memberA < memberB) {
            comparison = -1;
          }
          return comparison;
        });
      }

      state.currentTeam = team;
    },
    setTeamList(state, list) {
      state.teamList = list;
    },
    setTeamName(state, teamName) {
      state.currentTeam.teamName = teamName;
    },
  },
  actions: {
    async create({ rootGetters, state, commit, dispatch }, teamName) {
      if (!teamName) {
        commit("setInvalidTeamName", "โปรดระบุชื่อทีม");
      }

      if (!state.createStatus.isInvalid) {
        await TeamService.create({
          teamName: teamName,
          leader_id: rootGetters["auth/getUserId"],
        })
          .then((res) => {
            if (res.status == 201) {
              console.log(res.data.message);
              dispatch("checkTeam");
              commit("resetCreateStatus");
            } else if (res.status == 200) {
              console.log(res.data.message);
              window.location.href = "/dashboard";
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async checkDuplicated({ state, commit }, teamName) {
      commit("resetCreateStatus");
      if (!teamName) {
        return;
      }

      if (state.teamStatus.hasTeam && teamName == state.currentTeam.teamName) {
        return;
      }

      await TeamService.checkDuplicated({ teamName })
        .then((res) => {
          if (res.status == 200) {
            if (res.data.isFound) {
              commit("setInvalidTeamName", "ชื่อทีมนี้มีผู้ใช้แล้ว");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async rename({ state, commit }, teamName) {
      if (!teamName) {
        commit("setInvalidTeamName", "โปรดระบุชื่อทีม");
      }

      if (state.teamStatus.hasTeam && teamName == state.currentTeam.teamName) {
        return;
      }

      if (!state.createStatus.isInvalid) {
        await TeamService.rename({
          team_id: state.currentTeam.team_id,
          teamName: teamName,
        })
          .then((res) => {
            if (res.status == 200) {
              console.log(res.data.message);
              commit("setTeamName", res.data.teamName);
              commit("resetCreateStatus");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async delete({ state, commit, dispatch }) {
      await TeamService.delete({
        team_id: state.currentTeam.team_id,
      })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data.message);
            commit("resetCurrentTeam");
            commit("resetTeamStatus");
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async approve({ state, dispatch }, member_id) {
      await TeamService.approve({
        team_id: state.currentTeam.team_id,
        member_id: member_id,
      })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data.message);
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async reject({ state, dispatch }, member_id) {
      await TeamService.reject({
        team_id: state.currentTeam.team_id,
        member_id: member_id,
      })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data.message);
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async join({ rootGetters, commit, dispatch }, team_id) {
      await TeamService.join({
        team_id: team_id,
        member_id: rootGetters["auth/getUserId"],
      })
        .then((res) => {
          if (res.status == 201) {
            console.log(res.data.message);
            commit("resetCurrentTeam");
            commit("resetTeamStatus");
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async cancel({ rootGetters, commit, dispatch }, team_id) {
      await TeamService.leave({
        team_id: team_id,
        member_id: rootGetters["auth/getUserId"],
      })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data.message);
            commit("resetCurrentTeam");
            commit("resetTeamStatus");
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async leave({ rootGetters, state, commit, dispatch }) {
      await TeamService.leave({
        team_id: state.currentTeam.team_id,
        member_id: rootGetters["auth/getUserId"],
      })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data.message);
            commit("resetCurrentTeam");
            commit("resetTeamStatus");
            dispatch("checkTeam");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async checkTeam({ rootGetters, commit }) {
      await TeamService.checkTeam({
        user_id: rootGetters["auth/getUserId"],
      })
        .then((res) => {
          if (res.status == 200) {
            let data = res.data;
            if (data.teamStatus.hasTeam) {
              commit("setTeamStatus", data.teamStatus.status);
              commit("setCurrentTeam", data.team);
            } else {
              commit("setTeamList", data.teamList);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getTeamList({ commit }) {
      await TeamService.getAll()
        .then((res) => {
          if (res.status == 200) {
            commit("setTeamList", res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
