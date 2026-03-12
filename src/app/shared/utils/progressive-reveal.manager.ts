/**
 * Progressive Data Layer Reveal System
 * Handles staggered animations for nodes and connections as they come into view
 */

export interface RevealState {
  isRevealed: boolean;
  revealProgress: number;
  revealTime: number;
}

export class ProgressiveRevealManager {
  private nodeStates: Map<string, RevealState> = new Map();
  private connectionStates: Map<string, RevealState> = new Map();
  private revealDuration: number;
  private staggerDelay: number;

  constructor(revealDuration: number = 600, staggerDelay: number = 50) {
    this.revealDuration = revealDuration;
    this.staggerDelay = staggerDelay;
  }

  /**
   * Initialize node reveal states
   */
  initializeNodes(nodeIds: string[]): void {
    nodeIds.forEach((id, index) => {
      this.nodeStates.set(id, {
        isRevealed: false,
        revealProgress: 0,
        revealTime: index * this.staggerDelay,
      });
    });
  }

  /**
   * Initialize connection reveal states
   */
  initializeConnections(connectionIds: string[]): void {
    connectionIds.forEach((id, index) => {
      this.connectionStates.set(id, {
        isRevealed: false,
        revealProgress: 0,
        revealTime: index * this.staggerDelay,
      });
    });
  }

  /**
   * Update reveal progress
   */
  update(deltaTime: number = 16.667): void {
    this.updateStates(this.nodeStates, deltaTime);
    this.updateStates(this.connectionStates, deltaTime);
  }

  /**
   * Get reveal progress for a node (0-1)
   */
  getNodeRevealProgress(nodeId: string): number {
    const state = this.nodeStates.get(nodeId);
    if (!state) return 1;
    return Math.min(1, state.revealProgress);
  }

  /**
   * Get reveal progress for a connection (0-1)
   */
  getConnectionRevealProgress(connectionId: string): number {
    const state = this.connectionStates.get(connectionId);
    if (!state) return 1;
    return Math.min(1, state.revealProgress);
  }

  /**
   * Check if node is fully revealed
   */
  isNodeRevealed(nodeId: string): boolean {
    const state = this.nodeStates.get(nodeId);
    return state ? state.isRevealed : true;
  }

  /**
   * Check if connection is fully revealed
   */
  isConnectionRevealed(connectionId: string): boolean {
    const state = this.connectionStates.get(connectionId);
    return state ? state.isRevealed : true;
  }

  /**
   * Get opacity multiplier for smooth reveal
   */
  getNodeOpacity(nodeId: string): number {
    const progress = this.getNodeRevealProgress(nodeId);
    return Math.min(1, progress * 2); // Ease out effect
  }

  /**
   * Get opacity multiplier for connection
   */
  getConnectionOpacity(connectionId: string): number {
    const progress = this.getConnectionRevealProgress(connectionId);
    return Math.min(1, progress * 2);
  }

  /**
   * Get scale multiplier for node entrance
   */
  getNodeScale(nodeId: string): number {
    const progress = this.getNodeRevealProgress(nodeId);
    // Scale from 0.3 to 1 as progress goes from 0 to 1
    return 0.3 + progress * 0.7;
  }

  /**
   * Reset all reveal states
   */
  reset(): void {
    this.nodeStates.forEach((state) => {
      state.isRevealed = false;
      state.revealProgress = 0;
    });

    this.connectionStates.forEach((state) => {
      state.isRevealed = false;
      state.revealProgress = 0;
    });
  }

  /**
   * Get total revealed nodes percentage
   */
  getRevealPercentage(): number {
    if (this.nodeStates.size === 0) return 0;

    let revealedCount = 0;
    this.nodeStates.forEach((state) => {
      if (state.isRevealed) revealedCount++;
    });

    return (revealedCount / this.nodeStates.size) * 100;
  }

  private updateStates(
    states: Map<string, RevealState>,
    deltaTime: number
  ): void {
    states.forEach((state) => {
      state.revealTime -= deltaTime;

      if (state.revealTime <= 0 && !state.isRevealed) {
        state.revealProgress += deltaTime / this.revealDuration;

        if (state.revealProgress >= 1) {
          state.revealProgress = 1;
          state.isRevealed = true;
        }
      }
    });
  }
}
