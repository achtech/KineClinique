import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.translationService.language$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key?: string | null): string {
    if (!key) {
      return '';
    }
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


