import { Observable, Observer } from 'rxjs';

export const imagesValidator = (
  image: any
): Observable<boolean> => {
  const fileReader = new FileReader();
  const fileObs = new Observable(
    (observer: Observer<boolean>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(true);
        } else {
          observer.error(false);
        }
        observer.complete();
      });

      fileReader.readAsArrayBuffer(image);
    }
  );
  return fileObs;
};
