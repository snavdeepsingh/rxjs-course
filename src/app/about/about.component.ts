import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {interval, timer, fromEvent, Observable, noop, of, concat, merge, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
import util from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

 
  constructor() { }

  ngOnInit() {
    
    // const interval$ = interval(1000);
    // const interval$ = timer(3000, 1000);

    // const sub = interval$.subscribe(val => {
    //   console.log("stream1: ",val);
    //   console.log("stream2: ",val);
    // })

    // setTimeout(() => {
    //   sub.unsubscribe()
    // }, 5000);

// ============================================================

    // const click$ = fromEvent(document, 'click');
    // click$.subscribe(
    //   e => console.log(e),
    //   err => console.log(err),
    //   () => console.log("completed")
    //   );

  // =============================================================    

      const http$ = util.createHttpObservable('api/courses');

      const courses$ = http$
            .pipe(
              map(res => Object.values(res['payload']))
            )


      const sub: Subscription = courses$.subscribe(courses => {
        console.log(courses);
        
      },
      noop,
      ()=> console.log('completed'))
      // following code will cancel the http request
      // setTimeout(() => sub.unsubscribe(), 0);


//  ===============================================
      // const source1$ = of(1,2,3);
      // const source2$ = of(4,5,6);
      // const source3$ = of(7,8,9);

      // const result$ = concat(source1$, source2$, source3$)

      // result$.subscribe(console.log);
      // ======================================
      const interval1$ = interval(1000);
      const interval2$ = interval1$.pipe(map(val => val*10))

      const result2$ = merge(interval1$, interval2$);
      // result2$.subscribe(console.log);
      // ================================================

  }

  

}
