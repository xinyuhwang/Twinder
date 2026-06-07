from app.config import settings

_initialized = False


def init_weave() -> None:
    """Initialize Weave once, only if enabled. Safe to call on startup."""
    global _initialized
    if not settings.weave_enabled or _initialized:
        return
    import weave
    project = (
        f"{settings.wandb_entity}/{settings.wandb_project}"
        if settings.wandb_entity else settings.wandb_project
    )
    weave.init(project)
    _initialized = True
    _publish_all_prompts()


def op(*dargs, **dkwargs):
    """@op or @op(name=...). Delegates to weave.op when enabled, else no-op.

    Also exposes a .call(*args, **kwargs) shim on the decorated function
    that returns (result, None) when Weave is disabled, so call sites are
    mode-agnostic (used in Phase 4 for feedback attachment).
    """
    def wrap(fn):
        if not settings.weave_enabled:
            # Attach a .call shim so Phase 4 call sites work identically
            async def _call_shim(*args, **kwargs):
                result = await fn(*args, **kwargs)
                return result, None

            fn.call = _call_shim
            return fn
        import weave
        wrapped = weave.op(*dargs, **dkwargs)(fn)
        return wrapped

    # bare @op usage: @op (no args, function passed directly)
    if len(dargs) == 1 and callable(dargs[0]) and not dkwargs:
        bare_fn = dargs[0]
        dargs = ()
        return wrap(bare_fn)
    return wrap


def _publish_all_prompts() -> None:
    """Publish all known prompts as versioned Weave objects. Called once during init."""
    try:
        from app.agents.prompts import MATCH_CARD_SCORING_PROMPT, TWIN_SYSTEM_PROMPT, VIBE_SCORING_PROMPT
        from app.agents.profile import INTAKE_PROMPT
        from app.agents.synthesis import SYNTHESIS_PROMPT
        publish_prompt("intake_prompt", INTAKE_PROMPT)
        publish_prompt("synthesis_prompt", SYNTHESIS_PROMPT)
        publish_prompt("match_card_scoring_prompt", MATCH_CARD_SCORING_PROMPT)
        publish_prompt("twin_system_prompt", TWIN_SYSTEM_PROMPT)
        publish_prompt("vibe_scoring_prompt", VIBE_SCORING_PROMPT)
    except Exception:
        pass


def publish_prompt(name: str, text: str) -> None:
    """Publish a prompt as a versioned Weave object. No-op when disabled."""
    if not settings.weave_enabled:
        return
    try:
        import weave
        weave.publish(weave.StringPrompt(text), name=name)
    except Exception:
        pass


def add_call_feedback(call_id: str | None, verdict: str, rating: int | None = None, note: str | None = None) -> None:
    """Attach human feedback to a Weave trace. No-op when disabled or call_id is None."""
    if not settings.weave_enabled or not call_id:
        return
    try:
        import weave
        client = weave.get_client()
        if client is None:
            return
        call = client.get_call(call_id)
        if call is None:
            return
        reaction = "👍" if verdict == "save" else "👎"
        call.feedback.add_reaction(reaction)
        if rating is not None:
            call.feedback.add("rating", {"value": rating})
        if note:
            call.feedback.add_note(note)
    except Exception:
        pass
