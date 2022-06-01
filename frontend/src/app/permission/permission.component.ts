import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    alert(
      'You have attempted to access a page that you are not authorized to view. Please login or contact the site administrator should you have any queries.'
    );
    this.router.navigate(['/']);
  }

}
