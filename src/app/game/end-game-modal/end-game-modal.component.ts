import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Player} from '../../shared/players/model/player';
import {Router} from '@angular/router';

@Component({
  selector: 'app-end-game-modal',
  templateUrl: './end-game-modal.component.html',
  styleUrls: ['./end-game-modal.component.css']
})
export class EndGameModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Player,
              public dialogRef: MatDialogRef<EndGameModalComponent>,
              private router: Router) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.router.navigate(['login']).then();
    });

  }

  ngOnInit(): void {
  }

}
