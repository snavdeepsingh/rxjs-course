import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop, throwError} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize} from 'rxjs/operators';
import util from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;
    constructor() {

    }

    ngOnInit() {
        const http$ = util.createHttpObservable('api/courses');

      const courses$ :Observable<Course[]> = http$
            .pipe(
                // catchError(err => {
                //     console.log("Error occured: ", err)
                    
                //     return throwError(err);
                // }),
                // finalize(() => {
                //     console.log("finalize executed");
                // }),
                // tap operator is used to produce side effects in the observable chain
              tap(() => console.log("HTTP request")),
              map(res => Object.values(res['payload'])),
              shareReplay(),
            //   shareReplay is used for using one response across multiple subscription
            // to avoid multiple api calls
            // retryWhen is used if http request fails
              retryWhen(errors => errors.pipe(
                  delayWhen(() => timer(2000))
              ))
            )
                
        this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses.filter(course => course.category == "BEGINNER"))
            )

        this.advancedCourses$ = courses$
        .pipe(
            map(courses => courses.filter(course => course.category == "ADVANCED"))
        )


    //   courses$.subscribe(courses => {
    //     console.log(courses);
    //     this.beginnerCourses = courses.filter(course => course.category == 'BEGINNER')
    //     this.advancedCourses = courses.filter(course => course.category == 'ADVANCED');
    //   },
    //   noop,
    //   ()=> console.log('completed'))


    }

}
