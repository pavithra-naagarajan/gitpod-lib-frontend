import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { IssueBook } from 'src/app/models/issue-book';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { IssueBookService } from 'src/app/services/issue-book.service';
import { RequestBookService } from 'src/app/services/request-book.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-issue-book',
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.css']
})
export class IssueBookComponent implements OnInit {

  bookId?: number
  userId?: number
  book: Book;
  user: User;
  issueBook?: IssueBook;
  issueForm?: FormGroup
  numberOfDays?: number
  requestId?: number
  errorMessage?: string;
  calculateDays?: number
  totalDays?: number;
  days?: number
  adminId?: number
  constructor(public router: Router, public bookService: BookService, public issueBookService: IssueBookService,
    public userService: UserService, public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder, public requestBookService: RequestBookService) { }

  ngOnInit(): void {
    this.adminId = localStorage.getItem('adminId') as any;

    this.book = new Book()
    this.user = new User()
    this.issueBook = new IssueBook()
    this.bookId = this.activatedRoute.snapshot.params['bookId'];
    this.userId = this.activatedRoute.snapshot.params['userId'];
    this.numberOfDays = this.activatedRoute.snapshot.params['numberOfDays'];
    this.requestId = this.activatedRoute.snapshot.params['requestId'];

    this.bookService.getBookById(this.bookId).
      subscribe(data => {

        this.book = data


      })

    this.userService.getUserById(this.userId).subscribe((data: User) => {

      this.user = data


    })


    this.issueForm = this.formBuilder.group({

      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required],

    })

  }
  addDays(days: number): Date {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }

  addIssueBook() {



    this.issueBook.book = this.book
    this.issueBook.user = this.user
    this.issueBook.issueDate = this.issueForm?.get('issueDate').value
    this.issueBook.dueDate = this.issueForm?.get('dueDate').value

    this.issueBook.issueId = -1
    this.issueBook.fineAmount = 0

    if (this.issueBook.issueDate > this.issueBook.dueDate) {
      this.errorMessage = "***Not a valid Issue and Due Date"
    }

    else if (this.issueBook.issueDate == this.issueBook.dueDate) {
      this.errorMessage = "***Issue Date and Due Date are same!"
    }

    else {
      this.errorMessage = ""
      this.issueBookService.addIssueDetails(this.issueBook).subscribe(
        response => {
        }, error => {

          this.requestBookService.deleteRequestBookDetails(this.requestId).subscribe(response => {
          }, error => {

          })
          this.successNotification();
          this.router.navigate(['adminfunctions'])
        })

    }
  }



  return() {
    this.router.navigate(['adminfunctions'])
  }

  successNotification() {
    Swal.fire('Success', 'Book issued Successfully!', 'success')
  }


}
