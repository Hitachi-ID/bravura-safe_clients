import { Component, importProvidersFrom } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";

import { IconButtonModule } from "../icon-button";
import { LinkModule } from "../link";
import { MenuModule } from "../menu";

import { BreadcrumbComponent } from "./breadcrumb.component";
import { BreadcrumbsComponent } from "./breadcrumbs.component";

interface Breadcrumb {
  icon?: string;
  name: string;
  route: string;
}

@Component({
  template: "",
})
class EmptyComponent {}

export default {
  title: "Component Library/Breadcrumbs",
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      declarations: [BreadcrumbComponent],
      imports: [LinkModule, MenuModule, IconButtonModule, RouterModule],
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(
          RouterModule.forRoot([{ path: "**", component: EmptyComponent }], { useHash: true })
        ),
      ],
    }),
  ],
  args: {
    items: [],
    show: 3,
  },
  argTypes: {
    breadcrumbs: {
      table: { disable: true },
    },
    click: { action: "clicked" },
  },
} as Meta;

type Story = StoryObj<BreadcrumbsComponent & { items: Breadcrumb[] }>;

export const TopLevel: Story = {
  render: (args) => ({
  props: args,
  template: `
    <h3 class="tw-text-main">Router links</h3>
    <p>
      <bit-breadcrumbs [show]="show">
        <bit-breadcrumb *ngFor="let item of items" [icon]="item.icon" [route]="[item.route]">{{item.name}}</bit-breadcrumb>
      </bit-breadcrumbs>
    </p>

    <h3 class="tw-text-main">Click emit</h3>
    <p>
      <bit-breadcrumbs [show]="show">
        <bit-breadcrumb *ngFor="let item of items" [icon]="item.icon" (click)="click($event)">{{item.name}}</bit-breadcrumb>
      </bit-breadcrumbs>
    </p>
  `,
  }),

  args: {
  items: [{ icon: "fa-star", name: "Top Level" }] as Breadcrumb[],
  },
};

export const SecondLevel: Story = {
  ...TopLevel,
  args: {
  items: [
    { name: "Acme Vault", route: "/" },
    { icon: "fa-cube", name: "Collection", route: "collection" },
  ] as Breadcrumb[],
  },
};

export const Overflow: Story = {
  ...TopLevel,
  args: {
  items: [
    { name: "Acme Vault", route: "" },
    { icon: "fa-cube", name: "Collection", route: "collection" },
    { icon: "fa-cube", name: "Middle-Collection 1", route: "middle-collection-1" },
    { icon: "fa-cube", name: "Middle-Collection 2", route: "middle-collection-2" },
    { icon: "fa-cube", name: "Middle-Collection 3", route: "middle-collection-3" },
    { icon: "fa-cube", name: "Middle-Collection 4", route: "middle-collection-4" },
    { icon: "fa-cube", name: "End Collection", route: "end-collection" },
  ] as Breadcrumb[],
  },
};
