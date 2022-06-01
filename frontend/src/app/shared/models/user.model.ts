export class User {
  public id: string;
  public name: string; //
  public role: string;
  public email: string; //
  public phone: string; //
  public gender: string; //
  public school: string;
  public password: string; //
  public is_student: boolean;
  public birth: string;
  public cart: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.role = '';
    this.email = '';
    this.phone = '';
    this.gender = '';
    this.school = '';
    this.password = '';
    this.is_student = null;
    this.birth = '';
    this.cart = '';
  }
  toString() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      role: this.role,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      school: this.school,
      password: this.password,
      is_student: this.is_student,
      birth: this.birth,
      cart: this.cart
    });
  }
  getDisplayName() {
    return this.name != null ? this.name : this.email;
  }
}
