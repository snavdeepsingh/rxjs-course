import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import util from '../common/util';
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay,
    throttle,
    throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { fork } from 'cluster';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];
        this.course$ = util.createHttpObservable(`api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoggingLevel.INFO, "Course Value")
            )
        // following methid will set the different logging levels
        setRxJsLoggingLevel(RxJsLoggingLevel.TRACE)

        const lessions$ = this.loadLessions();

        // forkJoin Observable -> When all observables complete, emit the last emitted value from each.
        // If an inner observable does not complete forkJoin will never emit a value!
        forkJoin(this.course$, lessions$)
                .pipe(
                    tap(([course, lesson]) => {
                        console.log("courses: ", course);
                        console.log("Lessons: ", lesson)
                    })
                ).subscribe();
    }

    ngAfterViewInit() {

             this.lessons$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(e => e.target.value),
                // tap(sea => console.log(sea)),
                // startWith -> Emit given value first.
                startWith(''),
                debug(RxJsLoggingLevel.DEBUG, "search Value"),
                // debounceTime -> Discard emitted values that take less than the specified time between output
                // It waits for value to become stable before executing
                debounceTime(400),
                // throttle(() => interval(700)),
                // throttleTime(400),
                // distintUntilChanged -> Only emit when the current value is different than the last.
                distinctUntilChanged(),
                // switchMap -> This operator can cancel in-flight network requests!
                switchMap(search => this.loadLessions(search)),
                debug(RxJsLoggingLevel.TRACE, "Lessions value")
            );

    // ====================================================================
    // below is the code to concat two different observables
    //    const searchLessions$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
    //         .pipe(
    //             map(e => e.target.value),
    //             debounceTime(4),
    //             distinctUntilChanged(),
    //             switchMap(search => this.loadLessions(search))
    //         );

    //         // const initialLessons$ = this.loadLessions();

    //         // this.lessons$ = concat(initialLessons$, searchLessions$);
    }

    loadLessions(search = ''):Observable<Lesson[]>{
        return util.createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res['payload'])
        )
    }




}
