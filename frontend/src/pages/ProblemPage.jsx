import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import confetti from "canvas-confetti";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Navbar } from "../components/Navbar";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import { CodeOutput } from "../components/CodeOutput";
import { executeCode } from "../lib/piston";   // <-- Make sure name matches your file
import toast from "react-hot-toast";

function ProblemPage(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // Update problem when URL changes OR language changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);


  // ----------------------------
  // Language dropdown change
  // ----------------------------
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };


  // ----------------------------
  // Problem change (from dropdown)
  // ----------------------------
  const handleProblemChange = (newProblemId) =>
    navigate(`/problem/${newProblemId}`);


  // ----------------------------
  // Normalize output for comparison
  // ----------------------------
  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };


  // ----------------------------
  // Test case checker
  // ----------------------------
  const checkIfTestPassed = (actual, expected) => {
    const normActual = normalizeOutput(actual);
    const normExpected = normalizeOutput(expected);
    return normActual === normExpected;
  };


  const triggerConfetti=()=>{
    confetti({
      particleCount:80,
      spread:250,
      origin:{x:0.2,y:0.6},
    });

    confetti({
      particleCount:80,
      spread:250,
      origin:{x:0.8,y:0.6},
    });
  };
  // ----------------------------
  // Run Code
  // ----------------------------
  const handleRunCode = async () => {
    
    setIsRunning(true);
    setOutput(null); 

    const result = await executeCode(selectedLanguage, code);

    setOutput(result);  
    setIsRunning(false);

    if (result.success) {
      const expected = currentProblem.expectedOutput[selectedLanguage];
      const passed = checkIfTestPassed(result.output, expected);

      if (passed){ 
        toast.success("🎉 All test cases passed!");
        triggerConfetti();
      }
      else toast.error("❌ Test failed. Check your code!");
    }else {
      toast.error("Code execution failed");
    }
  };


  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            {/* Left Panel */}
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">

              {/* Code Editor Panel */}
              <Panel defaultSize={60} minSize={30}>
                <CodeEditor
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

              {/* Output Panel */}
              <Panel defaultSize={20} minSize={30}>
                <CodeOutput output={output} />
              </Panel>

            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;