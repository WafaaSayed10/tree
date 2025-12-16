import React, { useContext, useEffect,useRef, useState } from "react"
import * as d3 from "d3";
import { collection, onSnapshot } from "firebase/firestore";
import {db} from '../firebase'
import { ModalStateContext } from "../context/ModalStateContext"
import AddMemberModal from "./AddMemberModal"
import buildTree from "../utils/buildTree";

export default function Tree(){
  const [members, setMembers] = useState([])
  const {isOpenModal, setIsOpenModal}= useContext(ModalStateContext)

  const svgRef = useRef();

  const drawTree=(data)=>{
    const width = 1200;
    const height = 800;
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "visible");

    svg.selectAll("*").remove();
          
    //  transform data to hierarchy
    const root = d3.hierarchy(data);

    //  حساب أماكن العناصر
    const treeLayout = d3
      .tree()
      .size([width - 200, height - 250]);

    treeLayout(root);

    //  draw root
    const rootNode = root.descendants()[0];
    svg.append("rect")
      .attr("x", rootNode.x - 10)
      .attr("y", height - rootNode.y - 60)
      .attr("width", 20)
      .attr("height", 60)
      .attr("rx", 8)
      .attr("fill", "#6b4f2c");

    // draw branches
    svg
      .append("g")
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d => `
        M ${d.source.x} ${height - d.source.y}
        C ${d.source.x} ${height - (d.source.y + d.target.y) / 2},
          ${d.target.x} ${height - (d.source.y + d.target.y) / 2},
          ${d.target.x} ${height - d.target.y}
      `)
      .attr("fill", "none")
      .attr("stroke", "#6b4f2c")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", d =>
        Math.max(2, 8 - d.source.depth * 1.5)
      );

    // draw leaves and nodes
    const node = svg
      .append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr(
        "transform",
        d => `translate(${d.x}, ${height - d.y})`
      );

    // shap of leaf
    node
      .append("path")
      .attr("d", `
        M 0 0
        C 25 -25, 60 -10, 55 20
        C 45 50, 10 60, -10 40
        C -30 20, -20 -10, 0 0
      `)
      .attr("fill", "#22c55e")
      .attr("stroke", "#15803d")
      .attr("stroke-width", 1.5)
      .attr("transform", () => `
        rotate(${Math.random() * 30 - 15})
        scale(${0.9 + Math.random() * 0.2})
      `);

      // name of member
    node
      .append("text")
      .text(d => d.data.name)
      .attr("x", 20)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold");
  }
  useEffect(() => {
    return onSnapshot(
      collection(db, "members"),
      snap => {
        const flatData = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })))

        const treeData = buildTree(flatData)
        drawTree(treeData);
      }
    );
    
  }, []);
  
  return (
    <div className="p-[2rem] pb-[5rem]">
      <button onClick={()=>setIsOpenModal(true)} className="px-3 py-1 border rounded-full capitalize bg-green-300 text-green-900 hover:bg-green-400 transition duration-300">
          add memmber
      </button>
      {isOpenModal&& <AddMemberModal parents={members} />}
      <svg
        ref={svgRef}
        className="w-full h-screen bg-white"
      />
    </div>
  );
}