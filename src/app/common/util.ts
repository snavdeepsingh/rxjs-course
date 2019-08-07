
import { Observable } from 'rxjs';

 export default {
    createHttpObservable(url: string){
        return Observable.create(observer => {
        const controller = new AbortController();
        const signal = controller.signal;
          fetch(url, {signal})
          .then(response => {
            if(response.ok){
                return response.json()
            } else {
                observer.error("Request failed with status code: "+ response.status);
            }
          })
          .then(body => {
            observer.next(body);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          })

        //   to cancel the request 
        return () => controller.abort()
        })
      }
 }
