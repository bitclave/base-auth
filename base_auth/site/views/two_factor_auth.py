from django.http import HttpResponseNotFound
from two_factor.views.profile import ProfileView


class OverrideProfileView(ProfileView):

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return HttpResponseNotFound()

        return super().dispatch(request, *args, **kwargs)
