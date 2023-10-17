class MemberDTO {
  constructor({
    member_id,
    member_pw,
    member_name,
    member_engname,
    member_nickname,
    member_email,
    member_major,
    member_birth,
    member_number,
    member_gender,
    member_iscert,
    member_isadmin,
    member_regidate,
    member_reportcount
  }) {
    this.member_id = member_id;
    this.member_pw = member_pw;
    this.member_name = member_name;
    this.member_engname = member_engname;
    this.member_nickname = member_nickname;
    this.member_email = member_email;
    this.member_major = member_major;
    this.member_birth = member_birth;
    this.member_number = member_number;
    this.member_gender = member_gender;
    this.member_iscert = member_iscert;
    this.member_isadmin = member_isadmin;
    this.member_regidate = member_regidate;
    this.member_reportcount = member_reportcount;
  }

  toJSON() {
    return {
      member_id: this.member_id,
      member_pw: this.member_pw,
      member_name: this.member_name,
      member_engname: this.member_engname,
      member_nickname: this.member_nickname,
      member_email: this.member_email,
      member_major: this.member_major,
      member_birth: this.member_birth,
      member_number: this.member_number,
      member_gender: this.member_gender,
      member_iscert: this.member_iscert,
      member_isadmin: this.member_isadmin,
      member_regidate: this.member_regidate,
      member_reportcount: this.member_reportcount
    };
  }
}

module.exports = MemberDTO;
