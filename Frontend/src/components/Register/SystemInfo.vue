<template>
  <div id="systeminfo-box">
    <div @click="applicantClick()" class="center page-change-left">
      <i class="fa fa-angle-left" aria-hidden="true"></i>
      <h1 class="text-normal purple-text">ข้อมูลผู้สมัคร</h1>
    </div>

    <h1 class="header-m">ข้อมูลผู้ใช้งานระบบ</h1>
    <hr class="bar-color" />

    <div id="information" class="center">
      <div>
        <h1 class="header-s">ท่านมีทีมของตนเองแล้วหรือไม่</h1>
        <div class="team-checkbox">
          <div>
            <input v-model="user.hasTeam" value="true" type="radio" />
            <h1 class="text-normal">มี</h1>
          </div>
          <div>
            <input v-model="user.hasTeam" value="false" type="radio" />
            <h1 class="text-normal">ไม่มี</h1>
          </div>
        </div>
        <p
          v-if="isInvalid.hasTeam"
          class="text-normal orange-text error-message"
        >
          * {{ InvalidMessage.hasTeam }}
        </p>

        <div id="note">
          <h1 class="text-normal purple-text">หมายเหตุ :</h1>
          <h1 class="text-normal">
            การสร้างกลุ่มสามารถสร้าง <br />
            และเพิ่มสมาชิกได้ ภายหลังจากเข้าสู่ระบบ
          </h1>
        </div>

        <hr class="bar-color" />

        <h1 id="login-info" class="header-s">ข้อมูลสำหรับการเข้าสู่ระบบ</h1>

        <div>
          <h1 class="text-normal">Email: เพื่อใช้ในการเข้าสู่ระบบ</h1>
          <input
            v-model="user.email"
            class="input-box text-normal"
            type="text"
            maxlength="64"
            placeholder="{E-mail ใช้ข้อมูลเดียวกับช่องติดต่อ}"
            disabled
          />
        </div>

        <div>
          <h1 class="text-normal">Display Name : สำหรับแสดงผลในระบบ</h1>
          <input
            v-model="user.displayName"
            @blur="checkDuplicated()"
            :class="cssDisplayName"
            type="text"
            maxlength="16"
            autocomplete="off"
          />
        </div>
        <p
          v-if="isInvalid.displayName"
          class="text-normal orange-text error-message"
        >
          * {{ InvalidMessage.displayName }}
        </p>

        <div>
          <h1 class="text-normal">Password</h1>
          <input
            v-model="user.password"
            :class="cssPassword"
            type="password"
            maxlength="32"
            autocomplete="new-password"
          />
        </div>
        <p
          v-if="isInvalid.password"
          class="text-normal orange-text error-message"
        >
          * {{ InvalidMessage.password }}
        </p>

        <div>
          <h1 class="text-normal">Re-enter Password</h1>
          <input
            v-model="confirmPassword"
            :class="cssConfirmPassword"
            type="password"
            maxlength="32"
            autocomplete="new-password"
          />
        </div>
        <p
          v-if="isInvalid.confirmPassword"
          class="text-normal orange-text error-message"
        >
          * {{ InvalidMessage.confirmPassword }}
        </p>
      </div>
    </div>

    <hr class="bar-color" />

    <div class="center">
      <button @click="register()" :class="cssBtn">ยืนยันข้อมูล</button>
    </div>
  </div>
</template>

<script>
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import User from "../../models/user.model";

export default {
  props: ["user"],
  data() {
    return {
      isFormFilled: false,
      confirmPassword: "",
      isInvalid: {
        ...new User(false),
        confirmPassword: false,
      },
      InvalidMessage: {
        ...new User(false),
        confirmPassword: false,
      },
      duplicateDisplayName: false,
    };
  },
  computed: {
    cssBtn() {
      return this.checkForm() ? "btn-white" : "btn-grey";
    },
    cssDisplayName() {
      let error = "input-box text-normal error-input-box";
      let complete = "input-box text-normal";
      if (this.isInvalid.displayName) {
        return error;
      }
      return complete;
    },
    cssPassword() {
      let error = "input-box text-normal error-input-box";
      let complete = "input-box text-normal";
      if (this.isInvalid.password) {
        return error;
      }
      return complete;
    },
    cssConfirmPassword() {
      let error = "input-box text-normal error-input-box";
      let complete = "input-box text-normal";
      if (this.isInvalid.confirmPassword) {
        return error;
      }
      return complete;
    },
  },
  watch: {
    "user.hasTeam": function () {
      this.isInvalid.hasTeam = false;
      this.InvalidMessage.hasTeam = "";
      if (this.user.hasTeam == "true") {
        this.user.hasTeam = true;
      } else if (this.user.hasTeam == "false") {
        this.user.hasTeam = false;
      }
    },
    "user.displayName": function () {
      this.isInvalid.displayName = false;
      this.InvalidMessage.displayName = "";
    },
    "user.password": function () {
      this.isInvalid.password = false;
      this.InvalidMessage.password = "";
    },
    confirmPassword: function () {
      this.isInvalid.confirmPassword = false;
      this.InvalidMessage.confirmPassword = "";
    },
  },
  methods: {
    applicantClick() {
      this.$store.dispatch("page/setPage", "applicant");
    },
    register() {
      if (this.validateForm() && !this.isInvalid.displayName) {
        AuthService.register(this.user).then((res) => {
          if (res.status == 201) {
            console.log("Register success!");
            this.$emit("displayNamefunction", this.user.displayName);
            this.$store.dispatch("page/setPage", "popupRegister");
          } else {
            console.log("Something wrong!");
          }
        });
      }
    },
    checkDuplicated() {
      UserService.checkDuplicated({
        displayName: this.user.displayName,
      }).then((res) => {
        if (res.status == 200) {
          this.duplicateDisplayName = res.data.isFound;
          if (this.duplicateDisplayName) {
            this.isInvalid.displayName = true;
            this.InvalidMessage.displayName = "ชื่อผู้ใช้งานมีในระบบแล้ว";
            this.isFormFilled = false;
          }
        } else {
          console.log("Something wrong!");
        }
      });
    },
    checkForm() {
      let check =
        this.user.hasTeam == null
          ? false
          : !this.user.displayName
          ? false
          : !this.user.password
          ? false
          : !this.confirmPassword
          ? false
          : true;

      return check;
    },
    validateForm() {
      this.isFormFilled = true;
      if (this.user.hasTeam == null) {
        this.isInvalid.hasTeam = true;
        this.InvalidMessage.hasTeam = "โปรดระบุคำตอบ";
        this.isFormFilled = false;
      }
      if (!this.user.displayName) {
        this.isInvalid.displayName = true;
        this.InvalidMessage.displayName = "โปรดระบุชื่อผู้ใช้งาน";
        this.isFormFilled = false;
      } else if (this.user.displayName.length < 3) {
        this.isInvalid.displayName = true;
        this.InvalidMessage.displayName = "โปรดระบุชื่อผู้ใช้งานไม่ต่ำกว่า 3";
        this.isFormFilled = false;
      } else if (/[^A-Za-z0-9_.ก-๛]/.test(this.user.displayName)) {
        this.isInvalid.displayName = true;
        this.InvalidMessage.displayName = "โปรดระบุชื่อให้ถูกต้อง";
        this.isFormFilled = false;
      } else if (this.user.displayName == ".") {
        this.isInvalid.displayName = true;
        this.InvalidMessage.displayName = "โปรดระบุชื่อผู้ใช้งาน";
        this.isFormFilled = false;
      } else if (
        this.user.displayName[this.user.displayName.length - 1] == "."
      ) {
        this.isInvalid.displayName = true;
        this.InvalidMessage.displayName = "โปรดระบุชื่อผู้ใช้งาน";
        this.isFormFilled = false;
      }
      if (!this.user.password) {
        this.isInvalid.password = true;
        this.InvalidMessage.password = "โปรดระบุรหัสผ่าน";
        this.isFormFilled = false;
      } else if (this.user.password.length < 8) {
        this.isInvalid.password = true;
        this.InvalidMessage.password = "โปรดระบุรหัสผ่านอย่างน้อย 8 ตัว";
        this.isFormFilled = false;
      }
      if (!this.confirmPassword) {
        this.isInvalid.confirmPassword = true;
        this.InvalidMessage.confirmPassword = "โปรดยืนยันรหัสผ่าน";
        this.isFormFilled = false;
      } else if (this.user.password != this.confirmPassword) {
        this.isInvalid.confirmPassword = true;
        this.InvalidMessage.confirmPassword =
          "โปรดยืนยันรหัสผ่านให้ตรงกับรหัสผ่าน";
        this.isFormFilled = false;
      }

      return this.isFormFilled;
    },
  },
};
</script>

<style scoped>
#systeminfo-box {
  /* width: 100%; */
  margin-top: 30px;
  background-color: #ffffff;
  border-radius: 30px;
  padding: 28px 64px;
  position: relative;
}

.bar-color {
  width: 120px;
}

#information {
  margin-top: 20px;
}

#note {
  align-items: flex-start;
  margin-bottom: 20px;
  display: flex;
}

#note > h1:nth-child(2) {
  margin-left: 20px;
}

input[type="text"],
input[type="password"] {
  width: 407px;
}

#login-info {
  margin-top: 20px;
}

.header-s {
  text-align: left;
}

.btn-white,
.btn-grey {
  margin-top: 20px;
}

.fa {
  font-size: 2.25em;
  font-weight: 500;
}

.fa-angle-left {
  margin: 0px 15px 0px 0px;
  color: #bf2e7e !important;
}

.page-change-left {
  position: absolute;
  top: 35px;
}

.page-change-left {
  left: 50px;
  cursor: pointer;
}

.team-checkbox {
  margin-bottom: 15px;
  margin-top: 10px;
}

.team-checkbox,
.team-checkbox > div {
  display: flex;
  align-items: center;
}

.team-checkbox > div > input {
  margin-right: 11px;
}

.team-checkbox > div:nth-child(1) {
  margin-right: 60px;
}

@media screen and (max-width: 1100px) {
  #systeminfo-box {
    padding: 20px 40px;
  }

  .page-change-left {
    left: 40px;
  }

  .page-change-right {
    right: 40px;
  }
}

@media screen and (max-width: 767px) {
  #systeminfo-box {
    margin-top: 15px;
    padding: 20px 20px;
  }

  .page-change-left {
    left: 30px;
  }

  .page-change-right {
    right: 30px;
  }

  .page-change-right > h1,
  .page-change-left > h1 {
    display: none;
  }

  .fa {
    font-size: 3.25em;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
  }
}
</style>
