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
