import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  userList: Array<any> = [];
  userForm = new FormGroup({
      id: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl('')
    });

  constructor(private http: HttpClient) {
  }

  hayRegistros() {
    return this.userList.length>0;              
  }
  ngOnInit():void{
    let task = async () => {
      let response: any = await this.http.get<any>(`http://localhost:8080/user/read`).toPromise()
      .catch((err) => {
        console.log(err);
      }
      );
      console.log("Listado de base de datos",response);
      this.userList = response;
    }
    task();
  }

  delete(id:number){
    let task = async () => {
    let response: any = await this.http.delete(`http://localhost:8080/user/delete/${id}`).toPromise()
    .catch((err) => {
      console.log(err);
    });
    for(let x=0;x<this.userList.length;x++)
      if (this.userList[x].id==id)
      {
        this.userList.splice(x,1);
        return;
      }
    }
    task();
  }

  save():void{
    console.log('username: ' + this.userForm.value.username);
    console.log('password: ' + this.userForm.value.password);
    console.log("============================");
    let user = this.userForm.getRawValue();
       
    this.http.post<any>(`http://localhost:8080/user/save`,user).subscribe(
      data => { 
        for(let x=0;x<this.userList.length;x++)
          if (this.userList[x].username!=this.userForm.value.username){
            alert('Usuario guardado');
            window.location.reload();
            return;
          }
      })
  }

  update(userForm: { id: string; username: string; password: string; }) {
    console.log("seleccionar usuario de la tabla",userForm);
    let task = async () => {
      let user = this.userForm.getRawValue();
      const body = user;
      this.http.put<any>(`http://localhost:8080/user/update/${userForm.id}`,body).subscribe()
      for(let x=0;x<this.userList.length;x++)
        if (this.userList[x].id==this.userForm.value.id){
          this.userList[x].username=this.userForm.value.username;
          this.userList[x].password=this.userForm.value.password;
          return;
        }
        window.location.reload();  
    }
    task();
  }
}