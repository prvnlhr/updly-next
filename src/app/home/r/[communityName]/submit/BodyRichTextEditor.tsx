"use client";
import RichTextEditor from "reactjs-tiptap-editor";
import { BaseKit } from "reactjs-tiptap-editor";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { Italic } from "reactjs-tiptap-editor/italic";
import { Bold } from "reactjs-tiptap-editor/bold";
import { Link } from "reactjs-tiptap-editor/link";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { Strike } from "reactjs-tiptap-editor/strike";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { SubAndSuperScript } from "reactjs-tiptap-editor/subandsuperscript";
import { Table } from "reactjs-tiptap-editor/table";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";

import "react-image-crop/dist/ReactCrop.css";
import "reactjs-tiptap-editor/style.css";

const extensions = [
  // Core functionality first
  BaseKit.configure({
    placeholder: {
      placeholder: "Body text *",
      showOnlyCurrent: true,
    },
  }),

  // Text formatting
  Bold.configure({}),
  Italic.configure({}),
  TextUnderline.configure({}),
  Strike.configure({}),
  SubAndSuperScript,
  Blockquote,

  // Structural elements

  BulletList.configure({}),
  OrderedList.configure({}),
  HorizontalRule.configure({}),

  // Alignment
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  // Media and links
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 hover:underline",
    },
  }),
  Table,
];

// const customOptions: UseEditorOptions = {
//   onUpdate: ({ editor }) => console.log("Content updated:", editor.getText()),
//   onSelectionUpdate: ({ editor }) =>
//     console.log("Selection updated:", editor.getText()),
//   editable: true,
//   autofocus: "start",
// };

export const BodyRichTextEditor = ({
  onChange,
  value,
}: {
  onChange: (html: string) => void;
  value: string;
}) => {
  return (
    <div className="w-[100%]">
      <RichTextEditor
        dark={true}
        output="html"
        content={value}
        onChangeContent={onChange}
        extensions={extensions}
        // useEditorOptions={customOptions}
        hideBubble={true}
      />
    </div>
  );
};

export default BodyRichTextEditor;
