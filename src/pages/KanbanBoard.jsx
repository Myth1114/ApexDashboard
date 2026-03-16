import { PIPELINE_STAGES } from "../constants/pipelineStages";

import "./students/components/kanban/kanban.css";

import KanbanColumn from "./students/components/kanban/kanbanColumn";

function KanbanBoard() {
  return (
    <div className="kanban-board">
      {PIPELINE_STAGES.map((stage) => (
        <KanbanColumn key={stage.id} stage={stage} />
      ))}
    </div>
  );
}

export default KanbanBoard;
