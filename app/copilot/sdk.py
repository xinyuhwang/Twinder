from copilotkit import CopilotKitRemoteEndpoint

from app.copilot.actions import build_actions


def create_copilot_sdk() -> CopilotKitRemoteEndpoint:
    return CopilotKitRemoteEndpoint(actions=build_actions())
