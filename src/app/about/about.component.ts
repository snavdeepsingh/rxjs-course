import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    concat, fromEvent, interval, noop, 
    observable, Observable, of, timer, 
    merge, Subject, BehaviorSubject, 
    AsyncSubject, ReplaySubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        // Subject -> A special type of Observable which shares a single execution path among observers,
        const subject1 = new Subject();
        const series1$ = subject1.asObservable();
        series1$.subscribe(val => console.log("early series1: ",val))

        subject1.next(1);
        subject1.next(2);
        subject1.next(3);
        subject1.complete();
        setTimeout(() => {
            series1$.subscribe(val => console.log("late series1: ",val))
            subject1.next(4);

        }, 3000);

        // ==========================================================
        //  BehaviorSubject -> A Subject that requires an initial value and emits its current value to new subscribers
        const subject2 = new BehaviorSubject(0);
        const series2$ = subject2.asObservable();
        series2$.subscribe(val => console.log("early series2: ",val))

        subject2.next(1);
        subject2.next(2);
        subject2.next(3);
        // subject2.complete();
        setTimeout(() => {
            series2$.subscribe(val => console.log("late series2: ",val))
            subject2.next(4);

        }, 3000);

        // ===================================================
        // AsyncSubject -> completion is necessary for the subscription to emit value
        // A Subject that only emits its last value upon completion

        const subject3 = new AsyncSubject();
        const series3$ = subject3.asObservable();
        series3$.subscribe(val => console.log("early series3: ",val))

        subject3.next(1);
        subject3.next(2);
        subject3.next(3);
        subject3.complete();
        setTimeout(() => {
            series3$.subscribe(val => console.log("late series3: ",val))
            subject3.next(4);

        }, 3000);

        // =====================================================
        // ReplaySubject -> 

        const subject4 = new ReplaySubject();
        const series4$ = subject4.asObservable();
        series4$.subscribe(val => console.log("early series4: ",val))

        subject4.next(1);
        subject4.next(2);
        subject4.next(3);
        // subject4.complete();
        setTimeout(() => {
            series4$.subscribe(val => console.log("late series4: ",val))
            subject4.next(4);

        }, 3000);

    }


}






