export class Usuario {
  _id?: string;
  username: string;
  password: string; 
  rol: string;

  constructor(username: string, password: string, rol: string) {
    this.username = username;
    this.password = password;
    this.rol = rol;
  }
}
