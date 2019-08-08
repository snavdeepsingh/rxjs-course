import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { BehaviorSubject, Observable} from 'rxjs';
import {createHttpObservable} from '../common/util';
import { tap, map, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';


@Injectable ({
    providedIn: 'root'
})

export class Store {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable(); 

    init(){
        const http$ = createHttpObservable('/api/courses');

        http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"]) ),
            ).subscribe(
                courses => this.subject.next(courses)
            )
    }

    selectBeginnerCourses(){
        return this.courses$
        .pipe(
            map(courses => courses
                .filter(course => course.category == 'BEGINNER'))
        );
    }

    selectAdvancedCourses(){
        return this.courses$
        .pipe(
            map(courses => courses
                .filter(course => course.category == 'ADVANCED'))
        );
    }

    saveCourse(courseId: number, changes):Observable<any>{
        const courses = this.subject.getValue();
        const courseIndex = courses.findIndex(course => course.id == courseId);

        const newCourses = courses.slice(0);
        console.log(newCourses);
        const course1 = {
            ...courses[courseIndex],
            ...changes
        }


        newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        }

        this.subject.next(newCourses);

        return fromPromise(fetch(`api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }))
    }

    selectCourseById(courseId: number){
        return this.courses$
        .pipe(
            map(courses => courses
                .find(course => course.id == courseId)),
                filter(course => !!course)
        );
    }

}