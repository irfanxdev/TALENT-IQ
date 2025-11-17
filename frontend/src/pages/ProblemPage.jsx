import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
// for pannel we need to import the pannel
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Navbar } from "../components/Navbar";
import  ProblemDescription  from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import { CodeOutput } from "../components/CodeOutput";

function ProblemPage() {
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

  // update prblem when url param is changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {};

  const handleProblemChange = () => {};

  // for success message
  const triggerConfetti = () => {};

  const checkIfTestPassed = () => {};

  const handleRunCode = () => {};
  return (
    <div className="h-screen w-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            {/*left pannel for problem description  */}
            <ProblemDescription
             problem={currentProblem}
             currentProblemId={currentProblemId}
             onProblemChange={handleProblemChange}
             allProblems={Object.values(PROBLEMS)}  
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
          <Panel defaultSize={60} minSize={30}>
            {/*right pannel for code editor and output pannel  */}
            <PanelGroup direction="vertical">
                {/* upward panel for code editor  */}
                <Panel defaultSize={60} minSize={30}>
                    {/* <ProblemDescription/> */}
                    <CodeEditor/>
                </Panel>
              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors 
              cursor-col-resize" />

              {/* downword panel  for output section */}
               <Panel defaultSize={20} minSize={30}>
                    {/* <ProblemDescription/> */}
                 <CodeOutput/>
                </Panel>

            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
