<template>
  <div id="hamburger">
    <Slide right width="260" noOverlay>
      <div
        v-if="page != `dashBoard`"
        class="nav-head nav-link"
        @click="toggleDropdown()"
      >
        <p class="text-normal">
          ข้อมูลการแข่งขัน
          <img :class="cssDropdown" src="../../assets/navbar/dropdown.png" />
        </p>
      </div>

      <div v-if="page != `dashBoard`" :class="cssDropdownSlide">
        <div>
          <router-link v-if="page != `mainpage`" to="/#cp-info"
            >โจทย์การแข่งขัน</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#cp-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -73,
              updateHistory: true,
            }"
            >โจทย์การแข่งขัน</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#recieve-info"
            >สิ่งที่ผู้เข้าแข่งขันจะได้รับ</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#recieve-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -73,
              updateHistory: true,
            }"
            >สิ่งที่ผู้เข้าแข่งขันจะได้รับ</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#event-info"
            >กำหนดการ</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#event-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -80,
              updateHistory: true,
            }"
            >กำหนดการ</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#timeline-info"
            >ไทม์ไลน์การแข่งขัน</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#timeline-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -80,
              updateHistory: true,
            }"
            >ไทม์ไลน์การแข่งขัน</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#users-info"
            >คุณสมบัติผู้เข้าแข่งขัน</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#users-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -80,
              updateHistory: true,
            }"
            >คุณสมบัติผู้เข้าแข่งขัน</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#rules-info"
            >เกณฑ์การตัดสิน</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#rules-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -80,
              updateHistory: true,
            }"
            >เกณฑ์การตัดสิน</a
          >
        </div>
        <div>
          <router-link v-if="page != `mainpage`" to="/#reward-info"
            >รางวัลทั้งหมด</router-link
          >
          <a
            v-if="page == `mainpage`"
            class="text-normal"
            @click="hideNavDropdown"
            href="#reward-info"
            v-smooth-scroll="{
              duration: 1000,
              offset: -80,
              updateHistory: true,
            }"
            >รางวัลทั้งหมด</a
          >
        </div>
      </div>

      <div
        v-if="page == `dashBoard` || loginStatus.isAuthenticated == true"
        class="nav-head nav-link"
      >
        <a class="text-normal" @click="hideNav" href="/dashboard"
          >กลับหน้าแดชบอร์ด</a
        >
      </div>

      <div v-if="page != `dashBoard`" class="nav-head nav-link">
        <a class="text-normal" @click="hideNav" href="/about"
          >เกี่ยวกับโครงการ</a
        >
      </div>

      <!-- <div v-if="page == `dashBoard`" class="nav-head nav-link">
        <a class="text-normal" @click="hideNav" href="/">หน้าหลักการแข่งขัน</a>
      </div> -->

      <div
        v-if="page == `dashBoard` && roleStatus == `admin`"
        class="nav-head nav-link"
      >
        <a class="text-normal" @click="hideNav" href="/dashboard/member"
          >สมาชิกของระบบ</a
        >
      </div>

      <div
        v-if="page == `dashBoard` && roleStatus != `user`"
        class="nav-head nav-link"
      >
        <a class="text-normal" @click="hideNav" href="/dashboard/file"
          >File Management</a
        >
      </div>

      <div @click="workshopClick" class="nav-head nav-link">
        <a class="text-normal" @click="hideNav">Workshops</a>
      </div>
      <!-- <div v-if="page == `login`" class="nav-head nav-link">
        <p class="text-normal nav-text">Q&A</p>
      </div> -->
      <div class="nav-head nav-link">
        <router-link
          v-if="page != `mainpage`"
          to="/#contact-box"
          click="hideNav"
          class="text-normal nav-text"
          >ติดต่อเรา</router-link
        >

        <a
          v-if="page == `mainpage`"
          class="text-normal nav-text"
          href="#contact-box"
          v-smooth-scroll="{
            duration: 1000,
            offset: 0,
            updateHistory: true,
          }"
          >ติดต่อเรา</a
        >
      </div>

      <div
        v-if="page == `dashBoard` || loginStatus.isAuthenticated == true"
        class="nav-head nav-link display-name-box"
      >
        <a class="text-normal display-name" @click="hideNav" href="/dashboard"
          ><span v-if="roleStatus == `admin`">Admin </span
          ><span v-if="roleStatus == `editor`">Editor </span
          >{{ displayName }}</a
        >
      </div>
      <!-- <div class="nav-head nav-link register-btn">
        <a class="text-normal" href="/register">ลงทะเบียน</a>
      </div> -->

      <div
        v-if="page != `dashBoard` && endCountdown == true"
        class="nav-head nav-link register-btn"
      >
        <!-- อันเก่าที่ยังไม่มีปุ่มlogout -->

        <!-- <a
          class="text-normal"
          v-if="page != `agreement`"
          @click="registerClick()"
          >ลงทะเบียน</a
        >
        <a class="text-normal" v-if="page == `agreement`" @click="loginClick()"
          >เข้าสู่ระบบ</a
        > -->

        <!-- อันเก่าที่ยังไม่มีปุ่มlogout -->

        <!-- อันใหม่ที่มีปุ่มlogout -->

        <a
          class="text-normal register-text click-text"
          v-if="
            pathRegister == false &&
            loginStatus.isAuthenticated == false &&
            closeCountdown == false
          "
          @click="registerClick()"
          >ลงทะเบียน</a
        >
        <a
          class="text-normal click-text"
          v-if="
            (pathRegister == true || closeCountdown == true) &&
            loginStatus.isAuthenticated == false
          "
          @click="loginClick()"
          >เข้าสู่ระบบ</a
        >
        <a
          class="text-normal click-text"
          v-if="
            (page == `mainpage` || page == 'about' || page == 'workshop') &&
            loginStatus.isAuthenticated == true
          "
          @click="logout"
          >ออกจากระบบ</a
        >

        <!-- อันใหม่ที่มีปุ่มlogout -->
      </div>

      <div
        v-if="page != `dashBoard` && endCountdown == false"
        class="nav-head nav-link register-btn blocked click-text"
      >
        <a
          class="text-normal register-text"
          v-if="pathRegister == false && closeCountdown == false"
          >ลงทะเบียน</a
        >
        <a
          class="text-normal register-text"
          v-if="page == `agreement` || closeCountdown == true"
          >เข้าสู่ระบบ</a
        >
      </div>

      <div
        v-if="page == `dashBoard`"
        class="nav-head nav-link register-btn click-text"
      >
        <a class="text-normal" @click="logout">ออกจากระบบ</a>
      </div>
    </Slide>
  </div>
</template>

<script>
import { Slide } from "vue-burger-menu";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dropdown: true,
      pathRegister: false,
    };
  },
  components: {
    Slide, // Register your component
  },
  created() {
    if (this.$route.path == "/register") {
      this.pathRegister = true;
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },
    hideNavDropdown() {
      var x = document.getElementsByClassName("bm-menu");
      for (var i = 0; i < x.length; i++) {
        x[i].style.width = "0px";
        this.dropdown = !this.dropdown;
      }
    },
    hideNav() {
      var x = document.getElementsByClassName("bm-menu");
      for (var i = 0; i < x.length; i++) {
        x[i].style.width = "0px";
        this.dropdown = true;
      }
    },
    registerClick() {
      if (this.$route.path != "/register") {
        this.$router.push("/register");
      }
    },
    loginClick() {
      if (this.$route.path != "/login") {
        this.$router.push("/login");
      }
    },
    // dashboard(value) {
    //   this.$router.push(value);
    // },
    logout() {
      this.$store.dispatch("auth/logout");
      window.location.href = "/login";
    },
    logoutMainpage() {
      this.$store.dispatch("auth/logout");
      window.location.href = "/";
    },
    workshopClick() {
      if (this.$route.path != "/workshop") {
        this.$router.push("/workshop");
      }
    },
  },
  computed: {
    cssDropdown() {
      let down = "dropdown-down";
      let up = "dropdown-up";
      if (this.dropdown) {
        return up;
      }
      return down;
    },
    cssDropdownSlide() {
      let closed = "nav-list nav-link closed dropdown-nav";
      let open = "nav-list nav-link open dropdown-nav";
      if (this.dropdown) {
        return closed;
      }
      return open;
    },
    ...mapGetters({
      page: "page/getPage",
      displayName: "auth/getDisplayName",
      loginStatus: "auth/getLoginStatus",
      roleStatus: "auth/getRole",
      endCountdown: "page/getCountdownStatus",
      closeCountdown: "page/getCloseCountdownStatus",
    }),
  },
};
</script>

<style scoped>
.nav-link > a,
.nav-link > div > a,
.nav-link > p {
  text-decoration: none;
  color: #303030;
  font-size: 16px;
}

#hamburger {
  position: fixed;
  right: 10px;
}

.nav-head {
  padding-left: 40px;
}

.nav-head:not(:last-child) {
  border-top: 1px solid #e5e5e5;
}
.nav-list {
  padding-left: 60px;
}

.display-name {
  color: #764a97 !important;
  font-weight: 700;
  font-family: "IBM-PLEX-THAI-SEMIBOLD";
  padding-right: 6px;
  text-transform: capitalize;
}

.display-name-box {
  border-top: 1px solid #764a97 !important;
}

.click-text {
  cursor: pointer;
}

.dropdown-down {
  width: 15px;
  padding-right: 5px;
  transition: 0.3s;
  transform: rotate(180deg);
}

.dropdown-up {
  width: 15px;
  padding-left: 5px;
  transition: 0.3s;
}

.dropdown-nav {
  padding: 0px 0px 0px 60px;
}

.dropdown-nav > div:not(:first-child) {
  padding: 10px 0px 0px 0px;
}

.dropdown-nav > div:last-child {
  padding-bottom: 10px;
}

.closed {
  overflow: hidden;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  transition: all 0.5s ease;
  will-change: transform;
  display: block;
}

.open {
  max-height: 400px;
  overflow: hidden;
  transition: all 0.5s ease;
  will-change: transform;
  display: block;
}

.register-btn {
  border-top: 1px solid #bf2e7e;
  border-bottom: 1px solid #bf2e7e;
  background-image: linear-gradient(white, white),
    linear-gradient(#2f65af, #764a97, #bf2e7e, #f07821);
}

.register-btn > a {
  color: #bf2e7e;
  font-family: "IBM-PLEX-THAI-SEMIBOLD";
  font-size: 18px;
}

.blocked {
  background-color: #c4c4c4 !important;
  background-image: none;
  border: none;
}

.blocked > a {
  color: #ffffff !important;
}

@media screen and (max-width: 414px) {
  .nav-link > a,
  .nav-link > div > a,
  .nav-link > p {
    text-decoration: none;
    /* color: #303030; */
    font-size: 14px;
  }

  .register-text {
    color: #bf2e7e !important;
  }
}
</style>
