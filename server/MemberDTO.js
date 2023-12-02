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
    member_gender,
    member_iscert,
    member_isadmin,
    member_regidate,
    member_reportcount,
    member_grade,
    major_name,
    member_profile,
  }) {
    this.member_id = member_id;
    this.member_pw = member_pw;
    this.member_name = member_name;
    this.member_engname = member_engname;
    this.member_nickname = member_nickname;
    this.member_email = member_email;
    this.member_major = member_major;
    this.member_birth = member_birth;
    this.member_gender = member_gender;
    this.member_iscert = member_iscert;
    this.member_isadmin = member_isadmin;
    this.member_regidate = member_regidate;
    this.member_reportcount = member_reportcount;
    this.member_grade = member_grade;
    this.major_name=major_name;
    this.member_profile=member_profile;
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
      member_gender: this.member_gender,
      member_iscert: this.member_iscert,
      member_isadmin: this.member_isadmin,
      member_regidate: this.member_regidate,
      member_reportcount: this.member_reportcount,
      member_grade: this.member_grade,
      major_name:this.major_name,
      member_profile:this.member_profile,
    };
  }
}

module.exports = MemberDTO;
