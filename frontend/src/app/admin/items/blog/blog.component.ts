import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

import { LaptopService } from "src/app/shared/services/laptop.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FormControl, FormGroup } from "@angular/forms";
import { UtilService } from "src/app/shared/services/util.service";

// Editor Imports

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import LinkTool from "@editorjs/embed";
@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.css"],
})
export class BlogComponent implements OnInit {
  editor: any;
  data: any = null;
  product_id: string;
  final_data: string;
  converted_news_html: any[];
  raw_news_data: any;
  mode = "create";

  private blogForm: FormGroup;

  private readonly BLOG_URL = environment.apiURL + "/blog/";

  constructor(
    private _location: Location,
    private laptopService: LaptopService,
    private activatedRoute: ActivatedRoute,
    private _utilService: UtilService
  ) {
    this.blogForm = new FormGroup({
      content: new FormControl(),
      raw_content: new FormControl(),
      created_at: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        tap((params: any) => (this.product_id = params.id)),
        switchMap((params) => this.laptopService.getBlog(params.id)),
        take(1)
      )
      .subscribe((res: any) => {
        if (res) {
          this.data = res.raw_content;
          this.initEditor(this.data);
          this.mode = "edit";
        } else {
          this.initEditor(this.data);
        }
      });
  }

  initEditor(data: any) {
    this.editor = new EditorJS({
      holderId: "editor-blog",
      data: data,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["link"],
        },
        list: {
          class: List,
          inlineToolbar: ["link", "bold"],
        },
        marker: {
          class: Marker,
          shortcut: "CMD + SHIFT + M",
        },
        embed: {
          class: Embed,
          config: {
            service: {
              youtube: true,
              coub: true,
            },
          },
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${this.BLOG_URL}image`,
            },
            field: "image",
            types: "image/*",
          },
        },
      },
    });
  }

  saveData(): void {
    this.final_data = "";
    this.converted_news_html = [];
    this.editor
      .save()
      .then((outputData) => {
        this.raw_news_data = outputData;
        this.raw_news_data.blocks.forEach((block) => {
          switch (block.type) {
            case "paragraph":
              this.converted_news_html.push(
                `<p class="post-paragraph">${block.data.text}</p>`
              );
              break;
            case "header":
              this.converted_news_html.push(
                `<h${block.data.level} class="post-header">${block.data.text}</h${block.data.level}>`
              );
              break;
            case "image":
              if (block.data.caption !== "") {
                this.converted_news_html.push(
                  `<img src=${block.data.file.url} class="w-100 h-auto post-img"/><span class="post-img-caption mb-4">${block.data.caption}</span>`
                );
              } else if (block.data.caption === "") {
                this.converted_news_html.push(
                  `<img src=${block.data.file.url} class="w-100 h-auto post-img mb-4"/>`
                );
              }
              break;
            case "list":
              if (
                block.data.style === "ordered" &&
                block.data.items.length > 0
              ) {
                const listItemsArray = block.data.items;
                const listItemsHtml = listItemsArray.map(
                  (item) => `<li>${item}</li>`
                );
                this.converted_news_html.push(
                  `<ol class="post-ol">${listItemsHtml.join("")}</ol>`
                );
              } else if (block.data.style === "unordered") {
                const listItemsArray = block.data.items;
                const listItemsHtml = listItemsArray.map(
                  (item) => `<li>${item}</li>`
                );
                this.converted_news_html.push(
                  `<ul class="post-ul">${listItemsHtml.join("")}</ul>`
                );
              }
              break;
            case "quote":
              if (block.data.caption === "" && block.data.text !== "") {
                this.converted_news_html.push(
                  `<blockquote class='quote'>${block.data.text}</blockquote>`
                );
              } else if (block.data.caption !== "" && block.data.text !== "") {
                this.converted_news_html.push(
                  `<blockquote class='quote'>${block.data.text}<span>${block.data.caption}</span></blockquote>`
                );
              }
              break;
            case "embed":
              if (block.data.caption !== "") {
                this.converted_news_html.push(
                  `<div class='LinkExpander_Ratio'><iframe width='100%'height='450'src='${block.data.embed}'frameborder='0'allowfullscreen=''></iframe><span class="post-img-caption mb-4">${block.data.caption}</span></div>`
                );
              } else if (block.data.caption === "") {
                this.converted_news_html.push(
                  `<div class='LinkExpander_Ratio'><iframe width='100%'height='450'src='${block.data.embed}'frame border='0'allowfullscreen=''></iframe></div>`
                );
              }
              break;
          }
        });
        this.final_data = this.converted_news_html.join("");

        var now = new Date();
        this.blogForm.patchValue({
          content: JSON.stringify(this.final_data),
          raw_content: JSON.stringify(outputData),
          created_at: now.getTime(),
        });
        if (this.mode == "create") {
          this.laptopService
            .createBlog(this.blogForm.value, this.product_id)
            .subscribe((res: any) => {
              this._location.back();
              this._utilService.openSnackBar(res.msg, "Thành công");
            });
        } else {
          this.laptopService
            .editBlog(this.blogForm.value, this.product_id)
            .subscribe((res: any) => {
              this._location.back();
              this._utilService.openSnackBar(res.msg, "Thành công");
            });
        }
      })
      .catch((error) => {
      });
  }

  backClicked() {
    this._location.back();
  }
}
