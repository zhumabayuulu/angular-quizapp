import { Component } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {


  public questionList: any = []
  public currentQuestion: number = 0
  public points: number = 0
  counter = 30
  correctAnswer: number=0
  inCorectAnswer: number = 0
  interval$:any;
  progres : string="0"
  isQuizCompeted: boolean = false

  constructor(private questionService:QuestionService){}
 

  ngOnInit():void{
    this.getAllquestion()
    this.startCounter()
  }

  getAllquestion(){
    this.questionService.getQuestionJson()
    .subscribe(res => {
      this.questionList= res.question
    })
  }

  nextQuestion() {
    this.currentQuestion++
  }
  prevQuestion(){
    this.currentQuestion--
  }
  answer(currentQno:number,option: any){
    if(currentQno === this.questionList.length){
      setTimeout(() =>{
        this.isQuizCompeted = true
      },500);
      this.stopCounter()
    }
    if(option.correct){
      this.points += 10
      this.correctAnswer++
      
      setTimeout(()=>{
        this.currentQuestion++
        this.resetCounter()
        this.getProgres()
      },500);
     
    }else{
      this.points -= 10
      this.inCorectAnswer++
      setTimeout(()=>{
      this.currentQuestion++
      
      this.resetCounter()
      this.getProgres()
      },500);
    }
  }
  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val =>{
      this.counter--
      if(this.counter === 0){
        this.currentQuestion++
        this.counter=30
        this.points -= 10
      }
    })
    setTimeout(()=>{
      this.interval$.unsubscribe()
    },300000);
  }
  stopCounter(){
    this.interval$.unsubscribe()
    this.counter = 0
  }
  resetCounter(){
    this.stopCounter()
    this.counter = 30
    this.startCounter()
  }
  resetGame(){
    this.resetCounter()
    this.getAllquestion()
    this.points = 0
    this.counter = 30
    this.currentQuestion=0
    this.progres = "0"
  }
  getProgres(){
    this.progres = ((this.currentQuestion/this.questionList.length)*100).toString()
    return this.progres
  }
}

